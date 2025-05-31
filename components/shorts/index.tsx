import { Short } from '@/lib/generated/prisma' // Assuming this import is correct
import React from 'react'
import Options from './Options'

const Shorts = ({ shorts, aspectRatio = '9:16' }: { shorts: Short[], aspectRatio: string }) => {
    // console.log(shorts[0].url); // Good for debugging
    // console.log(aspectRatio); // Good for debugging

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-fit py-5'>
            {shorts.map((short) => (
                <div key={short.id} className='flex flex-col gap-2'>
                    {/* Corrected aspect ratio application */}
                    <div className={`w-full relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group ${aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-[16/9]'}`}>
                        <div className="relative group">
                            <video
                                controls
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 z-0"
                            >
                                <source src={short.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            <div className="absolute top-1/2 left-25 hidden group-hover:block z-10">
                                <Options />
                            </div>
                        </div>


                    </div>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-lg font-semibold'>{short.title}</h2>
                        <p className='text-sm text-timberwolf/90 line-clamp-2'>{short.highlightText}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Shorts