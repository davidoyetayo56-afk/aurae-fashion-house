import { useRef, useState } from "react";
import ThreeDViewer from "./ThreeDViewer.jsx";
import { products, byId, presets } from "../data/products";
import { useCart } from "../state/cart.jsx";
import { naira } from "../config";
import { whatsappUrl } from "../utils/whatsapp";
const cats = ["All", ...new Set(products.map((p) => p.category))];
export default function Showroom() {
  const view = useRef();
  const { add } = useCart();
  const [outfit, setOutfit] = useState(presets[0].outfit);
  const [sel, setSel] = useState(byId["jersey-23"]);
  const [cat, setCat] = useState("All");
  const [size, setSize] = useState("L");
  const pick = (p) => {
    setSel(p); setSize(p.sizes.includes(size) ? size : p.sizes[2] || "");
    setOutfit((o) => ({ ...o, [p.slot]: o[p.slot] === p.id ? null : p.id })); // click again = remove piece
  };
  const worn = Object.entries(outfit).filter(([, id]) => id).map(([slot, id]) => [slot, byId[id]]);
  const total = worn.reduce((s, [, p]) => s + p.price, 0);
  const lookUrl = whatsappUrl(worn.map(([, p]) => ({ name: p.name, size: p.sizes.length ? size : "", qty: 1, price: p.price })), total);
  const single = whatsappUrl([{ name: sel.name, size: sel.sizes.length ? size : "", qty: 1, price: sel.price }], sel.price);
  return (<main id="showroom" className="showroom">
    <aside className="left">
      <h2>AURAÈ 3D SHOWROOM</h2>
      <div className="chips">{cats.map((c) => <button key={c} className={c === cat ? "on" : ""} onClick={() => setCat(c)}>{c.toUpperCase()}</button>)}</div>
      <div className="list">{products.filter((p) => cat === "All" || p.category === cat).map((p) => (
        <button key={p.id} className={"item" + (outfit[p.slot] === p.id ? " on" : "")} onClick={() => pick(p)}>
          <span className="showroom-item-mark" aria-hidden="true">AURAÈ</span><span><small>{p.category.toUpperCase()}</small>{p.name}</span></button>))}</div>
      <small className="dim preset-label">STYLE PRESETS</small>
      <div className="chips">{presets.map((p) => <button key={p.name} onClick={() => setOutfit(p.outfit)}>{p.name}</button>)}</div>
    </aside>
    <section className="stage">
      <ThreeDViewer ref={view} outfit={outfit} />
      <div className="controls">
        <button onClick={() => view.current.front()}>FRONT</button><button onClick={() => view.current.back()}>BACK</button>
        <button onClick={() => view.current.zoom(0.8)}>ZOOM +</button><button onClick={() => view.current.zoom(1.25)}>ZOOM −</button>
        <button onClick={() => view.current.reset()}>RESET</button></div>
      <div className="mark">AURAÈ · DREAMS · FAITH · YOU</div>
    </section>
    <aside className="right">
      <h2>{sel.name}</h2><p className="tag">“{sel.tagline}”</p><p className="price">{naira(sel.price)}</p>
      <p className="dim">{sel.description}</p>
      {sel.sizes.length > 0 && <><small className="dim">SIZES</small><div className="chips">{sel.sizes.map((s) => <button key={s} className={s === size ? "on" : ""} onClick={() => setSize(s)}>{s}</button>)}</div></>}
      <p className="dim">{sel.available ? "IN STOCK" : "SOLD OUT"}</p>
      <button className="btn" onClick={() => add(sel, sel.sizes.length ? size : "")}>Add to bag <span aria-hidden="true">+</span></button>
      <a className="btn alt" href={single} target="_blank" rel="noreferrer">Order on WhatsApp <span aria-hidden="true">↗</span></a>
      <div className="look"><small className="dim">YOUR LOOK</small>
        {worn.map(([slot, p]) => <div className="row" key={slot}><span>{slot.toUpperCase()} — {p.name}</span><span>{naira(p.price)}</span></div>)}
        <div className="row"><b>TOTAL</b><b>{naira(total)}</b></div>
        <a className={"btn alt" + (worn.length ? "" : " off")} href={worn.length ? lookUrl : undefined} target="_blank" rel="noreferrer">Order this look <span aria-hidden="true">↗</span></a></div>
    </aside>
  </main>);
}
