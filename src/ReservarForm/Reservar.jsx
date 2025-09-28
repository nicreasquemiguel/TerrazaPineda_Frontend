import React, { useState } from 'react'
import Stepper from './Stepper'
import CalendarPicker from '../form/Calendar'
import SliderPersonas from './SliderPersonas'
import ExtrasCheckbox from './ExtrasCheckbox'
import Description from './Description'
import DetailsBooking from './DetailsBooking'
import { useReserveStore } from '../../store/reserveStore'
import { Toast } from '../../utils/useToast'
import { useAddEvent } from '../../store/queries'
import { useNavigate } from 'react-router-dom'
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md'

const Reservar = () => {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const { date, noPeople, description, overAge, acceptTerms, extrasSelected, reset } = useReserveStore()
  const { mutate, status } = useAddEvent()

  // Stepper steps
  const steps = [
    'Fecha',
    'Paquete',
    'Extras',
    'Descripción',
    'Resumen',
  ]

  // Step content
  const renderStep = () => {
    switch (step) {
      case 1:
        return <CalendarPicker />
      case 2:
        return <SliderPersonas />
      case 3:
        return <ExtrasCheckbox />
      case 4:
        return <Description />
      case 5:
        return <DetailsBooking />
      default:
        return null
    }
  }

  // Navigation
  const handleNext = () => {
    if (step === 1 && !date) {
      Toast.fire({ icon: 'error', title: 'Selecciona una fecha.' })
      return
    }
    if (step === 2 && !noPeople) {
      Toast.fire({ icon: 'error', title: 'Selecciona un paquete.' })
      return
    }
    if (step === 4 && (!description || description.length < 65)) {
      Toast.fire({ icon: 'error', title: 'Agrega una descripción (mínimo 65 caracteres).' })
      return
    }
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1)
  }

  // Submit
  const handleSubmit = e => {
    e.preventDefault()
    if (!overAge || !acceptTerms) {
      Toast.fire({ icon: 'warning', title: 'Debes aceptar los términos y ser mayor de edad.' })
      setStep(5)
      return
    }
    mutate(undefined, {
      onSuccess: () => {
        Toast.fire({ icon: 'success', title: '¡Reserva enviada!' })
        reset()
        navigate('/')
      },
      onError: () => {
        Toast.fire({ icon: 'error', title: 'Error al enviar la reserva.' })
      },
    })
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <div className="mt-10 w-full max-w-2xl">
        <h1 className="mb-2 text-3xl font-extrabold text-center md:text-4xl reserve-gradient-text">Solicita tu Reserva</h1>
        <p className="mx-auto mb-6 max-w-xl text-base text-center text-gray-600 md:text-lg">Se aprobará según los detalles de tu evento, tales como fecha, paquete, descripción, seguir pasos...</p>
        <Stepper step={step} />
        <form onSubmit={handleSubmit} className="flex flex-col items-center mt-8 w-full">
          <div className="w-full flex flex-col items-center justify-center min-h-[300px] mb-8">
            {renderStep()}
          </div>
          <div className="flex justify-between items-center mt-2 w-full">
            <button type="button" onClick={handleBack} disabled={step === 1} className="flex gap-2 items-center px-6 py-2 text-lg font-semibold text-white bg-black rounded-xl shadow transition hover:bg-gray-800 disabled:opacity-50">
              <MdNavigateBefore className="text-xl" /> Regresar
            </button>
            <div className="flex-1"></div>
            {step < 5 ? (
              <button type="button" onClick={handleNext} className="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] shadow-lg hover:opacity-90 transition text-lg flex items-center gap-2">
                Continuar <MdNavigateNext className="text-xl" />
              </button>
            ) : (
              <button type="submit" className="px-6 py-2 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] shadow-lg hover:opacity-90 transition flex items-center gap-2">
                Enviar solicitud
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Reservar