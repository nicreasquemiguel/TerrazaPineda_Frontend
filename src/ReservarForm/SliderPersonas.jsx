
import React, {  useContext, useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from "react-query";
import { getVenues } from '../../actions/booking';
import { useReserveStore } from '../../store/reserveStore';
import { queryPaquetes } from '../../store/queries';
import EventLoading from '../loading/EventLoading';



const SliderPersonas = ({costos, callback}) => {

  const [params, setParams] = useSearchParams()
  const [nPersonas, setPersonas ] = useState()
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState();
  const [changed, setChanged] = useState(false)
  const personas = parseInt(params.get('personas')) 
  console.log(personas);

  const { isLoading, state, data: paquetes, refetch } = queryPaquetes()
  // refetch()
  const { noPeople, addPeople } = useReserveStore()
  
  if (isLoading){
    return <EventLoading/>
  }

  const numPeople = () => { 
    if (personas && !changed)
      return personas 
    if (noPeople )
      return noPeople

    return null
  }

  console.log(paquetes);

  useEffect(()=>{
    setPaqueteSeleccionado(paquetes.filter(paquete => (paquete.n_people == numPeople() ))[0])
    console.log(paqueteSeleccionado);

  },[nPersonas])


  
  



const onPaqueteChange = (event) => {
    let n_people = parseInt(event.target.value)
    setPersonas(n_people)
    addPeople(n_people)
    setChanged(true)
}



  return (
    <>
  
    <div className='grid justify-center w-3/4 grid-cols-1 text-center !md:w-1/2 shadow-d rounded-2xl place-items-center'>
        <span className='col-span-3 font-black text-center text-teal-700 justify-self-center justify-items-center'>Elije tu paquete</span>
        <div className="grid justify-around gap-2 pt-3 grid-rows-auto ">
            <fieldset>
        {paquetes.map((paquete, index ) => {
          return ( 
            <div key={index} className="flex h-32 place-items-center">



            <div className="flex flex-wrap gap-3">
      <label htmlFor={"inline-radio-"+paquete.title}  className="cursor-pointer">
      <input id={"inline-radio-"+paquete.title} type="radio" name={"radio-"+paquete.title} className='sr-only peer'
      // className="max-w-xl p-5 text-gray-600 transition-all sr-only w-7 peer rounded-xl bg-slate-200 ring-2 ring-transparent hover:bg-black peer-checked:text-sky-600 hover:ring-blue-400 peer-checked:ring-offset-2"
      
      value={paquete.n_people} checked={paquete.n_people == paqueteSeleccionado?.n_people } onChange={(e)=> onPaqueteChange(e) }  />
        <div className="max-w-xl p-5 text-gray-600 transition-all w-72 rounded-xl bg-slate-200 ring-2 ring-transparent peer-checked:shadow-xl peer-checked:text-sky-600 hover:ring-blue-400 peer-checked:ring-offset-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p><span className="text-lg font-bold">{paquete.title}</span></p>

              <div>
                <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" /></svg>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-sm font-semibold text-gray-500 uppercase">{paquete.description}</p>
              <p className="text-sm font-bold">${paquete.price}</p>
            </div>
          </div>
        </div>
      </label>
      </div>
        </div>
        )
      })}
      </fieldset>

        </div> 
        {/* <span className='col-span-3 mt-20 font-bold text-md'>{noPeople} PERSONAS</span><br/>
        <span className='col-span-3 m-0 mb-5 text-xl font-bold text-green-500'>${paqueteSeleccionado?.price}</span><br/> 
     */}
    </div>



    </>
  )
}

export default SliderPersonas