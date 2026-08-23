"use client"

import React, { useState, useRef, useEffect } from 'react'
import PhoneInput, { getCountryCallingCode } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

const CountrySelect = ({ value, onChange, options, iconComponent: Icon }: any) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o: any) => o.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options
    .filter((x: any) => x.value) // faqat haqiqiy davlatlar
    .filter((x: any) => {
      const s = search.toLowerCase()
      return x.label.toLowerCase().includes(s) || `+${getCountryCallingCode(x.value)}`.includes(s)
    })

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors mr-2 outline-none text-[var(--neu-text)]"
        onClick={() => setOpen(!open)}
      >
        {value && Icon ? (
          <Icon country={value} label={selectedOption?.label} />
        ) : (
          <span className="w-[1.5rem] h-[1rem] bg-gray-500 rounded-sm inline-block" />
        )}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-[280px] h-[300px] bg-[var(--neu-bg)] border border-[var(--neu-border)] rounded-xl shadow-xl z-50 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-white/5">
            <input 
              type="text" 
              placeholder="Davlat yoki kod izlash..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 dark:bg-black/50 text-[var(--neu-text)] px-3 py-2 rounded-lg outline-none text-sm shadow-inner border border-[var(--neu-border)]"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">Davlat topilmadi.</div>
            ) : (
              filteredOptions.map((option: any) => (
                <button
                  key={option.value}
                  type="button"
                  className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-sm text-[var(--neu-text)] transition-colors"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                    setSearch('')
                  }}
                >
                  {Icon && <Icon country={option.value} label={option.label} />}
                  <span className="flex-1 truncate">{option.label}</span>
                  <span className="text-gray-500 font-mono">+{getCountryCallingCode(option.value)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function CustomPhoneInput({ name, required }: { name: string, required?: boolean }) {
  const [value, setValue] = useState<string | undefined>('')

  return (
    <div className={cn(
        "h-10 w-full min-w-0 rounded-xl border-none bg-[var(--neu-bg)] shadow-sm border border-[var(--neu-border)] px-4 py-2 text-base text-[var(--neu-text)] transition-colors outline-none focus-within:ring-2 focus-within:ring-indigo-500/50",
        "flex items-center"
    )}>
      <style dangerouslySetInnerHTML={{__html: `
        .PhoneInput {
          width: 100%;
          display: flex;
          align-items: center;
        }
        .PhoneInputCountryIcon {
          width: 1.5rem;
          height: 1rem;
          box-shadow: none;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .PhoneInputInput {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: inherit;
          font-size: inherit;
        }
        .PhoneInputInput::placeholder {
          color: #6b7280;
        }
        /* Custom scrollbar for our dropdown */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}} />
      <PhoneInput
        international
        defaultCountry="UZ"
        value={value}
        onChange={setValue}
        name={name}
        required={required}
        placeholder="+998 90 123 45 67"
        countrySelectComponent={CountrySelect}
        limitMaxLength={true}
      />
    </div>
  )
}
