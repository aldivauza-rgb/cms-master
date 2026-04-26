const Icon = ({ d, size = 24, stroke = '#354764', fill = 'none', strokeWidth = 1.5, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
)

export const IconStatistic = (p) => <Icon {...p} d={<>
  <path d="M22 7v13h-1"/><path d="M2 22h20"/>
  <path d="M9.5 4h5c1.5 0 2 .5 2 2v16h-9V6c0-1.5.5-2 2-2z"/>
  <path d="M4 10h2.5c1 0 1.5.5 1.5 1.5V22H2V12c0-1.5.5-2 2-2z"/>
  <path d="M19 15h-1c-1 0-1.5.5-1.5 1.5V22H21v-5c0-1.5-.5-2-2-2z"/>
</>}/>

export const IconScreenMirror = (p) => <Icon {...p} d={<>
  <path d="M22 14.97v-9c0-2-1-3-3-3H5c-2 0-3 1-3 3v9c0 2 1 3 3 3h14c2 0 3-1 3-3z"/>
  <path d="M12 21.03v-3.06M2.5 10h19M8 21h8"/>
</>}/>

export const IconBuildings = (p) => <Icon {...p} d={<>
  <path d="M3 22h19M3 22V5c0-2 1-3 3-3h6c2 0 3 1 3 3v17"/>
  <path d="M19 22V11c0-2-1-3-3-3h-1"/>
  <path d="M6 8h5M6 12h5M8.5 22v-3.5"/>
</>}/>

export const IconNotification = (p) => <Icon {...p} d={<>
  <path d="M12 6.44V9.77"/>
  <path d="M12.02 2c-3.68 0-6.66 2.98-6.66 6.66v2.1c0 .68-.29 1.72-.63 2.3L3.49 15.3c-.76 1.26-.24 2.67 1.15 3.14 4.63 1.55 9.63 1.55 14.26 0 1.29-.43 1.85-1.96 1.15-3.14l-1.24-2.05c-.34-.59-.63-1.62-.63-2.3v-2.3c0-3.67-3-6.65-6.68-6.65z"/>
  <path d="M15.33 18.82A3.34 3.34 0 0112 22.16c-.92 0-1.83-.37-2.48-1.02-.65-.65-1.02-1.56-1.02-2.32" strokeMiterlimit="10"/>
</>}/>

export const IconSetting = (p) => <Icon {...p} d={<>
  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
  <path d="M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47.79-1.49 1.07-2.28.6l-1.73-.99c-.91-.52-1.22-1.68-.7-2.59.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9z"/>
</>}/>

export const IconInbox = (p) => <Icon {...p} d={<>
  <path d="M22 14h-4l-2 3h-8l-2-3H2"/>
  <path d="M5.97 3.55L2.38 9.99c-.26.46-.38.98-.38 1.49v2.51h20v-2.51c0-.51-.12-1.03-.38-1.49L18.03 3.55C17.36 2.35 16.09 1.5 14.72 1.5H9.28c-1.37 0-2.64.85-3.31 2.05z"/>
</>}/>

export const IconArrowRight = (p) => <Icon {...p} d="M8.91 19.92l6.52-6.52a2 2 0 000-2.83L8.91 4.08"/>
export const IconEyeSlash  = (p) => <Icon {...p} d={<>
  <path d="M14.53 9.47L9.47 14.53a3.58 3.58 0 110-5.06 3.58 3.58 0 015.06 5.06z"/>
  <path d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73c-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19.79 1.24 1.71 2.31 2.71 3.17"/>
  <path d="M8.42 19.53c1.14.48 2.35.74 3.58.74 3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-.33-.52-.69-1.01-1.06-1.47"/>
  <path d="M15.51 12.7a3.565 3.565 0 01-2.82 2.82M9.47 14.53L2 22M22 2l-7.47 7.47"/>
</>}/>
export const IconEye = (p) => <Icon {...p} d={<>
  <path d="M15.58 12a3.58 3.58 0 11-7.16 0 3.58 3.58 0 017.16 0z"/>
  <path d="M12 20.27c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.79 0-5.2C18.82 5.79 15.53 3.71 12 3.71S5.18 5.79 2.89 9.39c-.9 1.41-.9 3.79 0 5.2 2.29 3.6 5.58 5.68 9.11 5.68z"/>
</>}/>
export const IconCloseCircle = (p) => <Icon {...p} d={<>
  <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"/>
  <path d="M9.17 14.83l5.66-5.66M14.83 14.83L9.17 9.17"/>
</>}/>
export const IconTickCircle = (p) => <Icon {...p} d={<>
  <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"/>
  <path d="M7.75 12l2.83 2.83 5.67-5.66"/>
</>}/>
export const IconInfoCircle = (p) => <Icon {...p} d={<>
  <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"/>
  <path d="M12 8v5M11.99 16h.01"/>
</>}/>
export const IconExit = (p) => <Icon {...p} d={<>
  <path d="M9.17 14.83l5.66-5.66M14.83 14.83L9.17 9.17"/>
  <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"/>
</>}/>
export const IconEdit = (p) => <Icon {...p} d={<>
  <path d="M13.26 3.6L5.05 12.29c-.31.33-.61.98-.67 1.43l-.37 3.24c-.13 1.17.71 1.97 1.87 1.77l3.22-.55c.45-.08 1.08-.41 1.39-.75l8.21-8.69c1.42-1.5 2.06-3.21-.15-5.3-2.2-2.07-3.87-1.34-5.29.16z"/>
  <path d="M11.89 5.05a6.13 6.13 0 005.45 5.15M3 22h18"/>
</>}/>
export const IconExport = (p) => <Icon {...p} d={<>
  <path d="M9 11.5l3-3 3 3M12 19V8.92"/>
  <path d="M20 14.67C20 19.11 18 21 14.14 21H9.86C6 21 4 19.11 4 14.67"/>
</>}/>
export const IconAdd = (p) => <Icon {...p} d={<>
  <path d="M8.5 12h7M12 15.5v-7"/>
  <path d="M2 12c0 7.5 2.5 10 10 10s10-2.5 10-10S19.5 2 12 2 2 4.5 2 12z"/>
</>}/>
export const IconSearch = (p) => <Icon {...p} d={<>
  <path d="M11.5 21a9.5 9.5 0 100-19 9.5 9.5 0 000 19zM22 22l-2-2"/>
</>}/>
export const IconCalendar = (p) => <Icon {...p} d={<>
  <path d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5v8.5c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z"/>
  <path d="M15.7 13.7h.01M15.7 16.7h.01M11.995 13.7h.01M11.995 16.7h.01M8.294 13.7h.01M8.294 16.7h.01"/>
</>}/>
export const IconTrash = (p) => <Icon {...p} d={<>
  <path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.7 9 2 10.7 2h2.6c1.7 0 1.83.74 1.98 1.67l.22 1.3M18.85 9.14L18.2 19.21c-.11 1.57-.2 2.79-2.99 2.79H8.79c-2.79 0-2.88-1.22-2.99-2.79L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5"/>
</>}/>
export const IconChevronDown  = (p) => <Icon {...p} d="M19.92 8.95l-6.52 6.52a2 2 0 01-2.83 0L4.08 8.95"/>
export const IconChevronLeft  = (p) => <Icon {...p} d="M15.09 19.92L8.57 13.4a2 2 0 010-2.83l6.52-6.52"/>
export const IconChevronRight = (p) => <Icon {...p} d="M8.91 19.92l6.52-6.52a2 2 0 000-2.83L8.91 4.08"/>
export const IconImage = (p) => <Icon {...p} d={<>
  <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"/>
  <path d="M9 10a2 2 0 100-4 2 2 0 000 4zM2.67 18.95l4.93-3.31c.79-.53 1.93-.47 2.64.14l.33.29c.78.67 2.04.67 2.82 0l4.16-3.57c.78-.67 2.04-.67 2.82 0L22 13.8"/>
</>}/>
export const IconBold       = (p) => <Icon size={p.size} stroke={p.stroke || '#010E23'} strokeWidth={2} d={<><path d="M6 4h7a4 4 0 010 8H6zM6 12h8a4 4 0 010 8H6z"/></>}/>
export const IconItalic     = (p) => <Icon size={p.size} stroke={p.stroke || '#010E23'} strokeWidth={2} d="M19 4h-9M14 20H5M15 4L9 20"/>
export const IconUnderline  = (p) => <Icon size={p.size} stroke={p.stroke || '#010E23'} strokeWidth={2} d={<><path d="M6 3v7a6 6 0 0012 0V3M4 21h16"/></>}/>
export const IconAlignLeft  = (p) => <Icon size={p.size} stroke={p.stroke || '#010E23'} strokeWidth={2} d="M3 6h18M3 12h12M3 18h18M3 24"/>
export const IconAlignCenter= (p) => <Icon size={p.size} stroke={p.stroke || '#010E23'} strokeWidth={2} d="M3 6h18M6 12h12M3 18h18"/>
export const IconAlignRight = (p) => <Icon size={p.size} stroke={p.stroke || '#010E23'} strokeWidth={2} d="M3 6h18M9 12h12M3 18h18"/>
export const IconLink = (p) => <Icon {...p} d={<>
  <path d="M10.59 13.41a5 5 0 007.07 0l3.54-3.54a5 5 0 00-7.07-7.07l-1.06 1.06M13.41 10.59a5 5 0 00-7.07 0l-3.54 3.54a5 5 0 007.07 7.07l1.06-1.06"/>
</>}/>
export const IconQuote = (p) => <Icon {...p} strokeWidth={2} d={<>
  <path d="M7 11H3a1 1 0 01-1-1V6a1 1 0 011-1h4a1 1 0 011 1v10c0 2-1 3-3 3M21 11h-4a1 1 0 01-1-1V6a1 1 0 011-1h4a1 1 0 011 1v10c0 2-1 3-3 3"/>
</>}/>
export const IconBack   = (p) => <Icon {...p} strokeWidth={2} d="M15 6l-6 6 6 6"/>
export const IconFilter = (p) => <Icon {...p} d={<>
  <path d="M5.4 2.1h13.2c1.1 0 2 .9 2 2v2.2c0 .8-.5 1.8-1 2.3L15.3 13c-.6.5-1 1.5-1 2.3V19c0 .6-.4 1.4-.9 1.7l-1.4.9c-1.3.8-3.1-.1-3.1-1.7v-4.7c0-.7-.4-1.6-.8-2.1L4.2 8.4c-.5-.5-.9-1.4-.9-2V4.2c0-1.2.9-2.1 2.1-2.1z"/>
</>}/>
export const IconTag = (p) => <Icon {...p} d={<>
  <path d="M3.92 12.48l8.56 8.56c1.11 1.11 2.89 1.11 4 0l4.13-4.13c1.11-1.11 1.11-2.89 0-4l-8.58-8.58c-.56-.56-1.36-.85-2.15-.81L5.54 4.04a1.96 1.96 0 00-1.83 1.83l-.44 4.34c-.05.8.24 1.6.81 2.16z"/>
  <path d="M9.5 10.5A1.5 1.5 0 119 7.62 1.5 1.5 0 019.5 10.5z"/>
</>}/>
export const IconDocument = (p) => <Icon {...p} d={<>
  <path d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5"/>
  <path d="M22 10h-4c-3 0-4-1-4-4V2l8 8zM7 13h6M7 17h4"/>
</>}/>
export const IconStar = (p) => <Icon {...p} d="M13.73 3.51l1.76 3.52c.24.49.88.96 1.42 1.05l3.19.53c2.04.34 2.52 1.82 1.05 3.28l-2.48 2.48c-.42.42-.65 1.23-.52 1.81l.71 3.07c.56 2.43-.73 3.37-2.88 2.1l-2.99-1.77c-.54-.32-1.43-.32-1.98 0l-2.99 1.77c-2.14 1.27-3.44.33-2.88-2.1l.71-3.07c.13-.58-.1-1.39-.52-1.81L2.85 11.89c-1.46-1.46-.98-2.94 1.05-3.28l3.19-.53c.53-.09 1.17-.56 1.41-1.05l1.76-3.52c.96-1.92 2.52-1.92 3.47 0z"/>
export const IconStarFill = ({ size = 24, fill = '#F5A623', stroke, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke || fill} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M13.73 3.51l1.76 3.52c.24.49.88.96 1.42 1.05l3.19.53c2.04.34 2.52 1.82 1.05 3.28l-2.48 2.48c-.42.42-.65 1.23-.52 1.81l.71 3.07c.56 2.43-.73 3.37-2.88 2.1l-2.99-1.77c-.54-.32-1.43-.32-1.98 0l-2.99 1.77c-2.14 1.27-3.44.33-2.88-2.1l.71-3.07c.13-.58-.1-1.39-.52-1.81L2.85 11.89c-1.46-1.46-.98-2.94 1.05-3.28l3.19-.53c.53-.09 1.17-.56 1.41-1.05l1.76-3.52c.96-1.92 2.52-1.92 3.47 0z"/>
  </svg>
)

export const IconHamburger = (p) => (
  <svg width={p.size || 20} height={p.size || 20} viewBox="0 0 24 24" fill="none"
    stroke={p.stroke || '#F9F9F9'} strokeWidth="2" strokeLinecap="round">
    <path d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
)
