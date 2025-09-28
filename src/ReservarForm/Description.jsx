import React, { useEffect, useState } from 'react'
import { useReserveStore } from '../../store/reserveStore'

const Description = () => {

  const { description, addDescription } = useReserveStore()

  return (
    <div className='p- text-center max-w-4xl w-full flex flex-col  justify-center items-center'>
        <span className='text-center text-teal-700 font-black justify-self-center  justify-items-center col-span-3'>Describe tu evento...</span>

        <label htmlFor="message" className="block mb-2 px-1 text-sm font-medium text-gray-900 dark:text-white">Explicanos un poco sobre el evento</label>

        <label htmlFor="message" className="block mb-4 px-1 text-sm font-medium text-gray-900 dark:text-white">Que tipo de fiesta, música o peticiones...</label>
        <textarea  id="message" onChange={(e)=>{
            addDescription(e.target.value)

        }} value={description ? description : ""} rows="4" className="block p-4 mb-10 w-3/4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Lo tomaremos en cuenta para la aprobación de su evento (MIN 65 chars)..."></textarea>

    </div>
  )
}

export default Description