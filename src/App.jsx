import { useEffect, useRef, useState } from 'react'
import { createShowroom, FINISHES } from './scene'
import { CFG, wa, HOTSPOTS } from './config'

const word = (t) => (t < 25 ? 'cold' : t < 36 ? 'cool' : t < 41 ? 'warm' : 'hot')

export default function App() {
  const cv = useRef(null), story = useRef(null), d3 = useRef(null), d4 = useRef(null), load = useRef(null), sc = useRef(null)
  const [fin, setFin] = useState('Brushed gold')
  const [water, setWater] = useState(false)
  const [temp, setTemp] = useState(38)
  const [hs, setHs] = useState(0)

  useEffect(() => {
    const ui = {
      story: story.current,
      chs: [...story.current.querySelectorAll('.ch')],
      d3: d3.current, d4: d4.current, load: load.current,
      lbs: [...document.querySelectorAll('.lb')],
      onAutoWater: () => setWater(true),
      onNoGL: () => document.body.classList.add('nogl'),
    }
    const s = createShowroom(cv.current, ui)
    sc.current = s
    return () => { if (s) s.dispose(); sc.current = null }
  }, [])
  useEffect(() => { sc.current && sc.current.setFin(fin) }, [fin])
  useEffect(() => { sc.current && sc.current.setWater(water) }, [water])
  useEffect(() => { sc.current && sc.current.setTemp(temp) }, [temp])

  const h = HOTSPOTS[hs]
  return (
    <>
      <canvas id="c" ref={cv} aria-label="Interactive 3D bathroom. Drag to look around." />
      <div className="shade" /><div className="lb t" /><div className="lb b" />
      <div id="load" ref={load}><b>HUMA</b><span>Preparing the showroom</span></div>
      <div id="fb">
        <h2>HUMA Hardware</h2>
        <p>The 3D showroom needs a newer browser or device. Message us and we will send photos and prices.</p>
        <a className="wa" href={wa('Hi HUMA, I’d like photos and prices.')}>Chat on WhatsApp</a>
      </div>
      <div className="brand">HUMA<small>Hardware · Harare</small></div>

      <main><div id="story" ref={story}>
        <section className="ch"><div><h1>HUMA</h1><div className="sub">Bathrooms, composed.</div><p className="hint">Scroll to step inside.</p></div></section>
        <section className="ch top"><div><h2>Every edge, considered.</h2><p>A floating vanity, a ceramic basin cut into one clean line, and a mixer that stands against black stone. Drag to look around.</p></div></section>
        <section className="ch top"><div><h2>Turn it on.</h2><p>Set the temperature and feel how the water changes. Try a rinse.</p></div></section>
        <section className="ch top"><div><h2>Make it yours.</h2><p>Four finishes, one tap to switch. The room changes with them.</p></div></section>
        <section className="ch"><div><h2>Take it home.</h2>
          <div className="card"><h3>Basin mixer + wall-hung vanity</h3>
            <ul>
              <li>Single-lever mixer, <b>{fin}</b></li>
              <li>Wall-hung vanity with ceramic basin</li>
              <li>Framed mirror with warm LED halo</li>
              <li>Finishes: matte black, brushed gold, chrome, gunmetal</li>
              <li>Vanity set from <b>$80</b></li>
            </ul>
            <a className="wa" href={wa(`Hi HUMA, I’d like a price and availability for the ${CFG.item} in ${fin}.`)} target="_blank" rel="noopener">Enquire on WhatsApp</a>
          </div></div></section>
      </div></main>

      <section id="real">
        <h2>The real range</h2>
        <p className="lead">HUMA’s own products, photographed. Tap a dot to see the detail.</p>
        <div className="hs">
          <img src="/img/sink.jpg" alt="HUMA waterfall smart sink" />
          {HOTSPOTS.map((p, i) => (
            <button key={p.title} className="dot" style={{ left: p.x + '%', top: p.y + '%' }} aria-label={p.title} aria-pressed={hs === i} onClick={() => setHs(i)} />
          ))}
        </div>
        <div className="cap">
          <img src={h.img} alt="" />
          <div><h3>{h.title}</h3><p>{h.text}</p>
            <a className="wa" style={{ marginTop: 14 }} href={wa('Hi HUMA, I’d like a price for the waterfall smart sink.')} target="_blank" rel="noopener">Ask about this sink</a></div>
        </div>
        <div className="van">
          <img src="/img/vanity.jpg" alt="HUMA wall-hung vanity set" />
          <div><h3>Wall-hung vanity set</h3><p>Wood-finish cabinet, ceramic basin and a framed mirror. From $80.</p>
            <a className="wa" href={wa('Hi HUMA, I’m interested in the wall-hung vanity set.')} target="_blank" rel="noopener">Ask about this vanity</a></div>
        </div>
      </section>

      <div className="dock" id="d3" ref={d3}>
        <button className="pill" aria-pressed={water} onClick={() => setWater(!water)}>Water</button>
        <input type="range" min="15" max="45" value={temp} onChange={(e) => setTemp(+e.target.value)} aria-label="Water temperature" />
        <span className="rd">{temp}° {word(temp)}</span>
        <button className="pill" onClick={() => sc.current && sc.current.rinse()}>Rinse</button>
      </div>
      <div className="dock" id="d4" ref={d4}>
        <div style={{ display: 'flex', gap: 12 }}>
          {Object.entries(FINISHES).map(([k, v]) => (
            <button key={k} className="sw" title={k} aria-label={k + ' finish'} aria-pressed={fin === k} style={{ background: v[2] }} onClick={() => setFin(k)} />
          ))}
        </div>
        <div className="fl">Finish: <b>{fin}</b></div>
      </div>
    </>
  )
}
