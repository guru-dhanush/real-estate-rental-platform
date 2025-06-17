import Link from 'next/link'
import React from 'react'

interface DweltinProps {
    className?: string;
    short?: boolean;
}

export const Dweltin = ({ className = '', short = false }: DweltinProps) => {
    return (
        <Link href="/" className={`flex items-center text-3xl font-bold text-[#004B93] ${className}`}>
            {short ? 'D' : 'Dwelt'} <span className="text-[#c9002b]">{short ? 'in' : 'in'}</span>
        </Link>
    )
}
