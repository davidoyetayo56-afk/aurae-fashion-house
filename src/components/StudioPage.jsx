import { useMemo, useRef, useState } from "react";
import ThreeDViewer from "./ThreeDViewer.jsx";
import { products, presets } from "../data/products.js";
import { useCart } from "../state/cart.jsx";
import { WHATSAPP_NUMBER } from "../config.js";

const categories = ["All", ...new Set(products.map((item) => item.category))];
const whatsapp = (message) => "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);

export default function StudioPage() {
  const viewer = useRef(null);
  const { add } = useCart();
  const [outfit, setOutfit] = useState(presets[0]?.outfit || {});
  const [selectedId, setSelectedId] = useState(products[0]?.id);
  const [category, setCategory] = useState("All");
  const [size, setSize] = useState(products[0]?.sizes?.[0] || "M");
  const [notice, setNotice] = useState("");
  const selected = products.find((item) => item.id === selectedId) || products[0];
  const worn = useMemo(() => Object.entries(outfit).filter(([, id]) => id).map(([slot, id]) => ({
    slot, product: products.find((item) => item.id === id)
  })).filter((entry) => entry.product), [outfit]);
  const visibleProducts = products.filter((item) => category === "All" || item.category === category);

  function chooseProduct(product) {
    setSelectedId(product.id);
    setSize(product.sizes?.[0] || "");
    setOutfit((current) => ({
      ...current,
      [product.slot]: current[product.slot] === product.id ? null : product.id
    }));
  }

  function applyPreset(preset) {
    setOutfit(preset.outfit);
    const firstId = Object.values(preset.outfit).find(Boolean);
    if (firstId) {
      const product = products.find((item) => item.id === firstId);
      if (product) {
        setSelectedId(product.id);
        setSize(product.sizes?.[0] || "");
      }
    }
  }

  if (!selected) return <section className="studio-empty"><h1>The studio is getting ready.</h1></section>;

  const enquiry = whatsapp("Hello AURAÈ, I'd like to enquire about " + selected.name + (size ? " in size " + size : "") + ". Please confirm the current price, availability and delivery details.");
  const lookMessage = "Hello AURAÈ, I'd like to enquire about this look:\n" + worn.map(({slot, product}) => slot.toUpperCase() + ": " + product.name).join("\n") + "\nPlease confirm pricing, availability and delivery.";

  return (
    <main className="studio-page">
      <header className="studio-heading">
        <div>
          <p className="eyebrow">AURAÈ / INTERACTIVE EXPERIENCE</p>
          <h1>THE 3D <i>STUDIO.</i></h1>
          <p>Build a look, rotate the mannequin and explore each piece from every angle.</p>
        </div>
        <span className="studio-live"><i /> INTERACTIVE VIEW</span>
      </header>

      <div className="studio-layout">
        <section className="studio-stage-column" aria-label="3D outfit preview">
          <div className="studio-stage">
            <div className="stage-topline"><span>VIRTUAL FITTING ROOM</span><span>DRAG TO ROTATE · PINCH TO ZOOM</span></div>
            <div className="stage-canvas"><ThreeDViewer ref={viewer} outfit={outfit} /></div>
            <div className="stage-controls" aria-label="Model view controls">
              <button type="button" onClick={() => viewer.current?.front()}>FRONT</button>
              <button type="button" onClick={() => viewer.current?.back()}>BACK</button>
              <button type="button" onClick={() => viewer.current?.reset()}>RESET VIEW</button>
            </div>
            <div className="stage-caption"><span>AURAÈ</span><small>COLLECTION 01 · DIGITAL SHOWROOM</small></div>
          </div>
          <div className="studio-presets">
            <div><span className="eyebrow">START WITH A LOOK</span><small>Choose a preset, then customise it.</small></div>
            <div className="preset-buttons">{presets.map((preset) => (
              <button key={preset.name} type="button" onClick={() => applyPreset(preset)}>{preset.name.replace("LOOK 0", "LOOK ")}</button>
            ))}</div>
          </div>
        </section>

        <aside className="studio-sidebar">
          <section className="studio-panel">
            <div className="panel-heading"><div><span className="eyebrow">01 / THE COLLECTION</span><h2>Choose your pieces</h2></div><span className="piece-count">{products.length} PIECES</span></div>
            <div className="studio-categories" aria-label="Filter products">
              {categories.map((item) => <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <div className="studio-products">
              {visibleProducts.map((product, index) => {
                const isWorn = outfit[product.slot] === product.id;
                return <button key={product.id} type="button" className={"studio-product" + (selectedId === product.id ? " selected" : "")} onClick={() => chooseProduct(product)} aria-pressed={isWorn}>
                  <span className={"studio-swatch swatch-" + index} aria-hidden="true"><b>A</b></span>
                  <span className="studio-product-copy"><small>{product.category.toUpperCase()}</small><strong>{product.name}</strong><em>{product.tagline}</em></span>
                  <span className={"wear-indicator" + (isWorn ? " worn" : "")}>{isWorn ? "ON MODEL ✓" : "TRY ON +"}</span>
                </button>;
              })}
            </div>
          </section>

          <section className="studio-panel selected-panel">
            <span className="eyebrow">02 / SELECTED PIECE</span>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
            <div className="studio-size-row">
              <span className="eyebrow">SELECT SIZE</span>
              <div>{selected.sizes.map((option) => <button key={option} type="button" className={size === option ? "active" : ""} onClick={() => setSize(option)}>{option}</button>)}</div>
            </div>
            <div className="studio-actions">
              <button className="studio-add" type="button" onClick={() => { add(selected, size || "One size"); setNotice(selected.name + " added to your bag."); }}>ADD TO BAG <span>＋</span></button>
              <a className="studio-enquire" href={enquiry} target="_blank" rel="noreferrer">ASK ABOUT THIS PIECE ↗</a>
            </div>
            {notice && <p className="studio-notice" role="status">{notice}</p>}
          </section>

          <section className="studio-look-summary">
            <div className="panel-heading"><div><span className="eyebrow">03 / YOUR LOOK</span><h2>Outfit summary</h2></div><span className="piece-count">{worn.length} SELECTED</span></div>
            {worn.length ? worn.map(({slot, product}) => <div className="look-line" key={slot}><span>{slot.toUpperCase()}</span><strong>{product.name}</strong><button type="button" aria-label={"Remove " + product.name} onClick={() => setOutfit((current) => ({...current, [slot]: null}))}>×</button></div>) : <p className="empty-look">Your look is empty. Try on a piece to get started.</p>}
            <a className={"look-enquire" + (!worn.length ? " disabled" : "")} href={worn.length ? whatsapp(lookMessage) : undefined} onClick={(event) => { if (!worn.length) event.preventDefault(); }} target="_blank" rel="noreferrer">ENQUIRE ABOUT THIS LOOK ↗</a>
          </section>
        </aside>
      </div>
      <p className="studio-footnote">3D previews are for visualisation. Final garment details, fit, price and availability are confirmed by AURAÈ before purchase.</p>
    </main>
  );
}
