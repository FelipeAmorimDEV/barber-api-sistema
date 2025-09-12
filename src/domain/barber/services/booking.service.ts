import { Injectable, Inject } from '@nestjs/common'
import { Booking, BookingStatus } from '../entities/booking.entity'
import { BookingRepository } from '../repositories/booking.repository'
import { ServiceRepository } from '../repositories/service.repository'
import { Either, left, right } from '@/core/either'
import { BookingNotFoundError } from '@/core/errors/booking-not-found-error'
import { BarberNotAvailableError } from '@/core/errors/barber-not-available-error'
import { InvalidTimeSlotError } from '@/core/errors/invalid-time-slot-error'
import { ServiceNotFoundError } from '@/core/errors/service-not-found-error'

@Injectable()
export class BookingService {
  constructor(
    @Inject('BookingRepository')
    private bookingRepository: BookingRepository,
    @Inject('ServiceRepository')
    private serviceRepository: ServiceRepository
  ) {}

  async createBooking(data: {
    clientId: string
    barberId: string
    serviceId: string
    date: Date
    startTime: string
    endTime: string
    status: BookingStatus
    notes?: string
  }): Promise<Either<BarberNotAvailableError | InvalidTimeSlotError, Booking>> {
    // Verificar se o barbeiro está disponível no horário
    const isAvailable = await this.checkBarberAvailability(
      data.barberId,
      data.date,
      data.startTime,
      data.endTime
    )

    if (!isAvailable) {
      return left(new BarberNotAvailableError())
    }

    // Validar se o horário é válido (não no passado, horário de funcionamento, etc.)
    const isValidTime = this.validateTimeSlot(data.date, data.startTime, data.endTime)
    
    if (!isValidTime) {
      return left(new InvalidTimeSlotError())
    }

    const booking = Booking.create(data)
    await this.bookingRepository.create(booking)

    return right(booking)
  }

  async findBookingById(id: string): Promise<Either<BookingNotFoundError, Booking>> {
    const booking = await this.bookingRepository.findById(id)
    
    if (!booking) {
      return left(new BookingNotFoundError())
    }

    return right(booking)
  }

  async findBookingsByClientId(clientId: string, page: number = 1): Promise<Booking[]> {
    return this.bookingRepository.findByClientId(clientId, { page })
  }

  async findBookingsByBarberId(barberId: string, page: number = 1): Promise<Booking[]> {
    return this.bookingRepository.findByBarberId(barberId, { page })
  }

  async findBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return this.bookingRepository.findByDateRange(startDate, endDate)
  }

  async findBookingsByBarberAndDate(barberId: string, date: Date): Promise<Booking[]> {
    return this.bookingRepository.findByBarberAndDate(barberId, date)
  }

  async updateBooking(id: string, data: Partial<{
    date: Date
    startTime: string
    endTime: string
    status: BookingStatus
    notes: string
  }>): Promise<Either<BookingNotFoundError | BarberNotAvailableError | InvalidTimeSlotError, Booking>> {
    const bookingResult = await this.findBookingById(id)
    
    if (bookingResult.isLeft()) {
      return bookingResult
    }

    const booking = bookingResult.value

    // Se está alterando horário, verificar disponibilidade
    if (data.date || data.startTime || data.endTime) {
      const newDate = data.date || booking.date
      const newStartTime = data.startTime || booking.startTime
      const newEndTime = data.endTime || booking.endTime

      const isAvailable = await this.checkBarberAvailability(
        booking.barberId,
        newDate,
        newStartTime,
        newEndTime,
        id // Excluir o próprio agendamento da verificação
      )

      if (!isAvailable) {
        return left(new BarberNotAvailableError())
      }

      const isValidTime = this.validateTimeSlot(newDate, newStartTime, newEndTime)
      
      if (!isValidTime) {
        return left(new InvalidTimeSlotError())
      }
    }

    if (data.date !== undefined) booking.date = data.date
    if (data.startTime !== undefined) booking.startTime = data.startTime
    if (data.endTime !== undefined) booking.endTime = data.endTime
    if (data.status !== undefined) booking.status = data.status
    if (data.notes !== undefined) booking.notes = data.notes

    await this.bookingRepository.save(booking)

    return right(booking)
  }

  async confirmBooking(id: string): Promise<Either<BookingNotFoundError, Booking>> {
    const bookingResult = await this.findBookingById(id)
    
    if (bookingResult.isLeft()) {
      return bookingResult
    }

    const booking = bookingResult.value
    booking.confirm()

    await this.bookingRepository.save(booking)

    return right(booking)
  }

  async cancelBooking(id: string): Promise<Either<BookingNotFoundError, Booking>> {
    const bookingResult = await this.findBookingById(id)
    
    if (bookingResult.isLeft()) {
      return bookingResult
    }

    const booking = bookingResult.value
    booking.cancel()

    await this.bookingRepository.save(booking)

    return right(booking)
  }

  async completeBooking(id: string): Promise<Either<BookingNotFoundError, Booking>> {
    const bookingResult = await this.findBookingById(id)
    
    if (bookingResult.isLeft()) {
      return bookingResult
    }

    const booking = bookingResult.value
    booking.complete()

    await this.bookingRepository.save(booking)

    return right(booking)
  }

  async deleteBooking(id: string): Promise<Either<BookingNotFoundError, void>> {
    const bookingResult = await this.findBookingById(id)
    
    if (bookingResult.isLeft()) {
      return left(bookingResult.value)
    }

    await this.bookingRepository.delete(id)

    return right(undefined)
  }

  async checkBarberAvailability(
    barberId: string,
    date: Date,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ): Promise<boolean> {
    const existingBookings = await this.bookingRepository.findByBarberAndDate(barberId, date)
    
    const conflictingBookings = existingBookings.filter(booking => {
      if (excludeBookingId && booking.id.toString() === excludeBookingId) {
        return false
      }
      
      return this.isTimeOverlapping(
        startTime,
        endTime,
        booking.startTime,
        booking.endTime
      )
    })

    return conflictingBookings.length === 0
  }

  private isTimeOverlapping(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    const time1Start = this.timeToMinutes(start1)
    const time1End = this.timeToMinutes(end1)
    const time2Start = this.timeToMinutes(start2)
    const time2End = this.timeToMinutes(end2)

    // Dois intervalos se sobrepõem se:
    // - O início do primeiro é menor que o fim do segundo E
    // - O início do segundo é menor que o fim do primeiro
    return time1Start < time2End && time2Start < time1End
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  private validateTimeSlot(date: Date, startTime: string, endTime: string): boolean {
    const now = new Date()
    
    // Criar a data do agendamento no fuso horário local
    const bookingDate = new Date(date)
    const [hours, minutes] = startTime.split(':').map(Number)
    
    // Criar a data/hora do agendamento combinando a data com o horário
    const bookingDateTime = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate(),
      hours,
      minutes
    )

    // Não permitir agendamentos no passado
    if (bookingDateTime < now) {
      return false
    }

    // Validar horário de funcionamento (8h às 18h, não incluindo 18h)
    const startMinutes = this.timeToMinutes(startTime)
    const endMinutes = this.timeToMinutes(endTime)

    if (startMinutes < 8 * 60 || endMinutes > 18 * 60) {
      return false
    }

    // Validar se o horário de fim é depois do início
    if (endMinutes <= startMinutes) {
      return false
    }

    return true
  }

  async getAvailableSlots(
    barberId: string,
    serviceId: string,
    date: Date
  ): Promise<Either<ServiceNotFoundError, {
    barberId: string
    serviceId: string
    date: string
    serviceDuration: number
    availableSlots: Array<{
      startTime: string
      endTime: string
      isAvailable: boolean
    }>
  }>> {
    // Buscar o serviço para obter a duração
    const service = await this.serviceRepository.findById(serviceId)
    
    if (!service) {
      return left(new ServiceNotFoundError())
    }

    // Buscar agendamentos existentes para o barbeiro na data
    const existingBookings = await this.bookingRepository.findByBarberAndDate(barberId, date)
    
    // Gerar todos os slots possíveis do dia (8h às 18h)
    const allSlots = this.generateTimeSlots(service.duration)
    
    // Verificar quais slots estão disponíveis
    const availableSlots = allSlots.map(slot => {
      const isAvailable = !existingBookings.some(booking => 
        this.isTimeOverlapping(
          slot.startTime,
          slot.endTime,
          booking.startTime,
          booking.endTime
        )
      )
      
      return {
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable
      }
    })

    return right({
      barberId,
      serviceId,
      date: date.toISOString(),
      serviceDuration: service.duration,
      availableSlots
    })
  }

  private generateTimeSlots(serviceDuration: number): Array<{ startTime: string; endTime: string }> {
    const slots: Array<{ startTime: string; endTime: string }> = []
    const startHour = 8 // 8h
    const endHour = 18 // 18h (não incluindo)
    const slotInterval = 30 // Intervalo de 30 minutos entre slots
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += slotInterval) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        const endTimeMinutes = hour * 60 + minutes + serviceDuration
        const endHour = Math.floor(endTimeMinutes / 60)
        const endMin = endTimeMinutes % 60
        
        // Verificar se o slot não ultrapassa o horário de funcionamento (até 18h, não incluindo)
        if (endHour < 18) {
          const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`
          slots.push({ startTime, endTime })
        }
      }
    }
    
    return slots
  }
}
