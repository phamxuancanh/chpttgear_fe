/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* LOADABLE FALLBACK COMPONENT: LOADING
   ========================================================================== */
import React from 'react'
import { PacmanLoader } from 'react-spinners'
const Loading = () => {
    return <div className="absolute inset-0 flex justify-center items-center w-full h-140 mt-20">
        <PacmanLoader
            className='flex justify-center items-center w-full mt-20'
            color='#5EEAD4'
            cssOverride={{
                display: 'block',
                margin: '0 auto',
                borderColor: 'blue'
            }}
            loading
            margin={10}
            speedMultiplier={3}
            size={40}
        /></div>
}

export default Loading