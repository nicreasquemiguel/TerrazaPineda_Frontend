import React, { useEffect } from 'react'
import { login } from '../../utils/auth'
import { queryExtras } from '../../store/queries';
import { useReserveStore } from '../../store/reserveStore';

const ExtrasCheckbox = () => {
    const { extrasSelected, removeExtra, addExtra } = useReserveStore()

    const { isLoading,state, data: extras } = queryExtras()
    console.log(extrasSelected);
    
    const onClickExtras = (e) => {
      const id = parseInt(e.target.value)
      console.log(e.target.value);
      console.log(e.target.checked);
      
      if( !e.target.checked){
        removeExtra(id)
      } else {
        addExtra(id)
      }
    }
  return (
<div className='text-center '>


<span className='text-center text-teal-700 font-black justify-self-center  justify-items-center col-span-3'>Elije tu servicios extra...</span>
<div className="pt-3 grid grid-rows-3 gap-2 justify-around ">
    
    {extras.map((extra, index ) => {
        return ( 
        <div key={index} className="flex h-32 place-items-center">



            <div className="flex flex-wrap gap-3">
      <label className="cursor-pointer">
      <input id={"inline-checkbox-"+extra.title} type="checkbox" name={"checkbox-"+extra.title} className='peer sr-only'
      // className="w-7 peer sr-only max-w-xl rounded-xl bg-slate-200 p-5 text-gray-600 ring-2 ring-transparent transition-all hover:bg-black peer-checked:text-sky-600 hover:ring-blue-400 peer-checked:ring-offset-2"
      
        value={extra.id} onChange={(e)=> onClickExtras(e) }  checked={extrasSelected.includes(extra.id)}/>
        <div className="w-72 max-w-xl rounded-xl bg-slate-200 p-5 text-gray-600 ring-2 ring-transparent transition-all peer-checked:shadow-xl peer-checked:text-sky-600 hover:ring-blue-400 peer-checked:ring-offset-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p><span className="text-lg font-bold">{extra.title}</span></p>

              <div>
                <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" /></svg>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-sm font-semibold uppercase text-gray-500">{extra.description}</p>
              <p className="text-sm font-bold">${extra.price}</p>
            </div>
          </div>
        </div>
      </label>
      </div>
        </div>
        )
    })}

</div>

</div>


  )
}

export default ExtrasCheckbox