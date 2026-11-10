import { useEffect, useState } from "react";
import { CartProvider, useCart } from "./state/cart.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import FloatingTote from "./components/FloatingTote.jsx";
import StudioPage from "./components/StudioPage.jsx";
import { products } from "./data/products.js";
import { WHATSAPP_NUMBER } from "./config.js";

const whatsapp = (message) => "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
const contactUrl = whatsapp("Hello AURAÈ, I'd like to enquire about the collection.");
const routeFromHash = () => {
  const [page, id] = window.location.hash.replace(/^#\/?/, "").split("/");
  return { page: page || "home", id: id || "" };
};

function AppShell() {
  const [route, setRoute] = useState(routeFromHash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { count, add } = useCart();
  const selected = products.find((product) => product.id === route.id);

  useEffect(() => {
    const update = () => {
      setRoute(routeFromHash());
      setMenuOpen(false);
      setCartOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  useEffect(() => {
    const names = { home: "Home", shop: "Shop", collections: "Collection 01", studio: "3D Studio", lookbook: "Lookbook", about: "Our Story", product: selected?.name || "Piece" };
    document.title = "AURAÈ — " + (names[route.page] || "Streetwear");
  }, [route.page, selected?.name]);

  const links = [["shop","SHOP"],["collections","COLLECTION"],["studio","3D STUDIO"],["lookbook","LOOKBOOK"],["about","OUR STORY"]];

  return <div className={"site" + (route.page === "home" ? " home-site" : "")}>
    <div className="topline"><span>INDEPENDENT STREETWEAR</span><i /><span>DREAMS · FAITH · YOU</span></div>
    <header className="header">
      <a className="wordmark" href="#/" aria-label="AURAÈ home">AURAÈ<span>✳</span></a>
      <button className="menu-toggle glass" type="button" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? "×" : "☰"}</button>
      <nav className={"navlinks" + (menuOpen ? " open" : "")} aria-label="Main navigation">
        {links.map(([page,label]) => <a key={page} className={route.page === page ? "active" : ""} href={"#/" + page}>{label}</a>)}
      </nav>
      <button className="bag glass" type="button" onClick={() => setCartOpen(true)} aria-label={"Open bag with " + count + " items"}>BAG <span>{String(count).padStart(2,"0")}</span> ↗</button>
    </header>

    <main key={route.page + route.id}>
      {route.page === "home" && <HomePage />}
      {route.page === "shop" && <CatalogPage title="THE PIECES." eyebrow="AURAÈ / COLLECTION 01" items={products} />}
      {route.page === "collections" && <CatalogPage title="THE NEW DROP." eyebrow="AURAÈ / THE COLLECTION" items={products} />}
      {route.page === "studio" && <StudioPage />}
      {route.page === "product" && selected && <ProductPage product={selected} onAdd={(p,size) => add(p,size)} />}
      {route.page === "lookbook" && <LookbookPage />}
      {route.page === "about" && <AboutPage />}
      {route.page === "product" && !selected && <EmptyPage title="PIECE NOT FOUND." />}
      {!["home","shop","collections","studio","product","lookbook","about"].includes(route.page) && <EmptyPage title="PAGE NOT FOUND." />}
    </main>
    {route.page !== "home" && route.page !== "studio" && <Footer />}
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    {["shop","collections","product","studio"].includes(route.page) && <FloatingTote count={count} onOpen={() => setCartOpen(true)} />}
  </div>;
}

function HomePage() {
  return <div className="home-premium-layout">
    <div className="home-premium-shade" />
    <div className="home-premium-kicker">DREAMS · FAITH · YOU</div>
    <div className="home-premium-copy">
      <p className="eyebrow">AURAÈ / COLLECTION 01</p>
      <h1>AURAÈ</h1>
      <p className="home-premium-subtitle">WEAR YOUR OWN STORY.</p>
      <a className="home-premium-cta" href="#/shop">EXPLORE THE COLLECTION <span>↗</span></a>
    </div>
    <div className="home-premium-tiles">
      {products.slice(0,4).map((p,i) => <a className="home-premium-tile" key={p.id} href={"#/product/"+p.id}>
        <img src={p.image} alt={p.name} loading={i===0?"eager":"lazy"} />
        <span className="home-premium-tile-shade" />
        <span className="home-premium-tile-number">0{i+1} / AURAÈ</span>
        <span className="home-premium-tile-copy"><strong>{p.name}</strong><small>{p.category.toUpperCase()} · COLLECTION 01</small></span>
        <span className="home-premium-tile-arrow">↗</span>
      </a>)}
    </div>
  </div>;
}

function CatalogPage({ title, eyebrow, items }) {
  return <section className="catalog">
    <p className="eyebrow">{eyebrow}</p><h1>{title}</h1>
    <p className="intro">The AURAÈ first drop. Six pieces, made to stand out. Tap any piece to see the details or try it in the 3D Studio.</p>
    <div className="collection-grid">{items.map((p,i) => <a className="collection-card" key={p.id} href={"#/product/"+p.id}>
      <div className="collection-image"><img src={p.image} alt={p.name} loading="lazy" /><span>VIEW PIECE ↗</span></div>
      <small className="collection-desc">{String(i+1).padStart(2,"0")} / {p.category.toUpperCase()}</small>
      <h2>{p.name}</h2>
      <p className="product-description">{p.description}</p>
    </a>)}</div>
  </section>;
}

function ProductPage({ product, onAdd }) {
  const [size,setSize] = useState(product.sizes[0] || "");
  const [added,setAdded] = useState(false);
  return <section className="product-page">
    <div className="product-image"><img src={product.image} alt={product.name} /></div>
    <div className="product-info">
      <p className="eyebrow">{product.category.toUpperCase()} / AURAÈ</p>
      <h1>{product.name}</h1>
      <p className="product-tag">“{product.tagline}”</p>
      <p>{product.description}</p>
      <div className="notice"><span className="notice-dot" />Price and availability are confirmed directly with AURAÈ before your order is finalised.</div>
      <div className="size-block"><span className="eyebrow">SELECT SIZE</span><div className="sizes">{product.sizes.map((option) => <button key={option} className={"size-option"+(size===option?" selected":"")} onClick={() => setSize(option)} type="button" aria-pressed={size===option}>{option}</button>)}</div></div>
      <div className="product-actions">
        <button className="pill primary" onClick={() => {onAdd(product,size);setAdded(true)}} type="button">ADD TO BAG ＋</button>
        <a className="pill outline" href={whatsapp("Hello AURAÈ, I'm interested in "+product.name+" in size "+size+". Please confirm price and availability.")} target="_blank" rel="noreferrer">ASK ON WHATSAPP ↗</a>
      </div>
      {added && <p className="added-note" role="status">{product.name} added to your bag.</p>}
      <a className="textlink" href="#/studio">TRY IT IN THE 3D STUDIO ↗</a>
    </div>
  </section>;
}

function LookbookPage() {
  return <section className="catalog"><p className="eyebrow">AURAÈ / THE VISUAL DIARY</p><h1>COLLECTION <i>01.</i></h1><p className="intro">The first AURAÈ drop. Take a closer look at every piece.</p>
    <div className="lookbook-grid">{products.map((p,i)=><figure key={p.id}><a href={"#/product/"+p.id}><img src={p.image} alt={p.name} loading="lazy"/></a><figcaption>0{i+1} / {p.name.toUpperCase()}</figcaption></figure>)}</div>
  </section>;
}
function AboutPage() {
  return <section className="about-page"><p className="eyebrow">WHY AURAÈ EXISTS</p><h1>MADE FOR<br/><i>THE BECOMING.</i></h1><p>AURAÈ is independent streetwear built around a simple idea: what you wear can remind you who you are and where you are going.</p><p>Dreams are the vision. Faith is the anchor. You are the becoming. Every print and every detail is a reminder to move with intention.</p><a className="pill primary" href={contactUrl} target="_blank" rel="noreferrer">TALK TO AURAÈ ↗</a></section>;
}
function EmptyPage({title}) { return <section className="catalog empty-state"><p className="eyebrow">AURAÈ</p><h1>{title}</h1><a className="pill primary" href="#/">BACK HOME ↗</a></section>; }
function Footer() {
  return <footer className="footer"><div className="footer-main"><a className="wordmark" href="#/">AURAÈ<span>✳</span></a><p>DREAMS. FAITH. YOU.</p><a className="footer-contact" href={contactUrl} target="_blank" rel="noreferrer">HAVE A QUESTION? SAY HELLO ↗</a></div><nav className="footer-nav"><a href="#/shop">SHOP</a><a href="#/collections">COLLECTION</a><a href="#/studio">3D STUDIO</a><a href="#/lookbook">LOOKBOOK</a><a href="#/about">OUR STORY</a></nav><small>© {new Date().getFullYear()} AURAÈ. ALL RIGHTS RESERVED.</small></footer>;
}
export default function App() { return <CartProvider><AppShell /></CartProvider>; }
