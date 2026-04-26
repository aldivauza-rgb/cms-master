import { useState, useEffect, useRef } from 'react'
import {
  IconBold, IconItalic, IconUnderline,
  IconAlignLeft, IconAlignCenter, IconAlignRight,
  IconLink, IconQuote,
} from './Icons'

export default function RichEditor({ value, onChange, placeholder = 'Tulis konten di sini...' }) {
  const ref = useRef()
  const [heading, setHeading] = useState('p')

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) {
      ref.current.innerHTML = value || ''
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const exec = (cmd, arg) => {
    ref.current?.focus()
    document.execCommand(cmd, false, arg)
    onChange(ref.current.innerHTML)
  }

  const applyHeading = (v) => {
    setHeading(v)
    exec('formatBlock', v === 'p' ? '<p>' : `<${v}>`)
  }

  const TbBtn = ({ onClick, title, children, wide }) => (
    <button type="button" onClick={onClick} title={title} style={{
      width: wide ? undefined : 34, height: 34, padding: wide ? '0 10px' : 0,
      borderRadius: 6, border: '1px solid var(--color-border)',
      background: 'var(--color-card)', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
    }}>{children}</button>
  )

  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-card)', overflow: 'hidden' }}>
      <div style={{
        background: 'var(--color-surface-3)', borderBottom: '1px solid var(--color-border)',
        padding: '10px 12px', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
      }}>
        <select value={heading} onChange={e => applyHeading(e.target.value)} style={{
          height: 34, borderRadius: 6, border: '1px solid var(--color-border)',
          background: 'var(--color-card)', padding: '0 10px',
          fontFamily: 'var(--font-base)', fontSize: 13, cursor: 'pointer',
        }}>
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 4px' }}/>
        <TbBtn onClick={() => exec('bold')} title="Bold"><IconBold size={16}/></TbBtn>
        <TbBtn onClick={() => exec('italic')} title="Italic"><IconItalic size={16}/></TbBtn>
        <TbBtn onClick={() => exec('underline')} title="Underline"><IconUnderline size={16}/></TbBtn>
        <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 4px' }}/>
        <TbBtn onClick={() => exec('justifyLeft')} title="Left"><IconAlignLeft size={16}/></TbBtn>
        <TbBtn onClick={() => exec('justifyCenter')} title="Center"><IconAlignCenter size={16}/></TbBtn>
        <TbBtn onClick={() => exec('justifyRight')} title="Right"><IconAlignRight size={16}/></TbBtn>
        <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 4px' }}/>
        <TbBtn onClick={() => { const url = prompt('URL:'); if (url) exec('createLink', url) }} title="Link">
          <IconLink size={16}/>
        </TbBtn>
        <TbBtn onClick={() => exec('formatBlock', '<blockquote>')} title="Quote">
          <IconQuote size={16}/>
        </TbBtn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={e => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        style={{
          minHeight: 240, padding: '16px 20px', outline: 'none',
          fontFamily: 'var(--font-base)', fontSize: 14, lineHeight: 1.65, color: 'var(--color-text-dark)',
        }}
      />
    </div>
  )
}
