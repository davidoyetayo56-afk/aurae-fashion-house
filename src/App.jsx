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
    const names = { home: "Dreams in Motion", shop: "Shop", collections: "Collections", studio: "3D Studio", lookbook: "Lookbook", about: "Our Story", product: selected?.name || "The Piece" };
    document.title = "AURAÈ — " + (names[route.page] || "Independent Streetwear");
  }, [route.page, selected?.name]);

  const links = [["shop","SHOP"],["collections","COLLECTIONS"],["studio","3D STUDIO"],["lookbook","LOOKBOOK"],["about","OUR STORY"]];

  return <div className="site">
    <div className="topline"><span>INDEPENDENT STREETWEAR</span><i /> <span>DREAMS · FAITH · YOU</span></div>
    <header className="header">
      <a className="wordmark" href="#/" aria-label="AURAÈ home">AURAÈ<span>✳</span></a>
      <button className="menu-toggle glass" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? "×" : "☰"}</button>
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
      {route.page === "product" && selected && <ProductPage product={selected} onAdd={(product,size) => add(product,size)} />}
      {route.page === "lookbook" && <LookbookPage />}
      {route.page === "about" && <AboutPage />}
      {route.page === "product" && !selected && <EmptyPage title="PIECE NOT FOUND." />}
      {!["home","shop","collections","studio","product","lookbook","about"].includes(route.page) && <EmptyPage title="THIS PAGE ISN'T HERE." />}
    </main>

    {route.page !== "home" && route.page !== "studio" && <Footer />}
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    {["shop","collections","product","studio"].includes(route.page) && <FloatingTote count={count} onOpen={() => setCartOpen(true)} />}
  </div>;
}

function HomePage() {
  return <div className="home-page">
    <section className="home-hero">
      <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
      <div className="hero-copy">
        <p className="eyebrow">DREAMS. FAITH. YOU.</p>
        <h1>WEAR YOUR<br/><i>OWN STORY.</i></h1>
        <p>Independent streetwear for the ones becoming something more. Thoughtful details. Distinctive graphics. A point of view that belongs to you.</p>
        <div className="hero-actions"><a className="pill primary" href="#/shop">EXPLORE THE DROP ↗</a><a className="pill outline" href="#/studio">ENTER 3D STUDIO <span>✳</span></a></div>
      </div>
      <div className="hero-side-note"><span>COLLECTION 01</span><span>EST. AURAÈ</span></div>
      <div className="hero-bottom"><span>01 — 03 / THE PIECES</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>
    <section className="home-intro">
      <span className="eyebrow">A DIFFERENT KIND OF STREETWEAR</span>
      <h2>Made for the<br/><i>becoming.</i></h2>
      <p>Dreams are the vision. Faith is the anchor. You are the becoming. Every AURAÈ piece is a reminder to move with intention.</p>
      <a className="textlink" href="#/about">DISCOVER OUR STORY ↗</a>
    </section>
    <section className="home-products">
      <div className="section-heading"><div><span className="eyebrow">COLLECTION 01</span><h2>THE NEW <i>DROP.</i></h2></div><a className="textlink" href="#/shop">VIEW ALL PIECES ↗</a></div>
      <ProductGrid items={products.slice(0,3)} />
    </section>
    <section className="studio-callout"><div><span className="eyebrow">AURAÈ / DIGITAL SHOWROOM</span><h2>See it.<br/><i>Style it.</i></h2><p>Step into the 3D studio and build your own look on our virtual mannequin.</p><a className="pill primary" href="#/studio">ENTER THE 3D STUDIO ↗</a></div><div className="callout-orb"><span>AURAÈ</span><small>INTERACTIVE<br/>FASHION</small></div></section>
  </div>;
}

function CatalogPage({ title, eyebrow, items }) {
  return <section className="catalog">
    <p className="eyebrow">{eyebrow}</p><h1>{title}</h1>
    <p className="intro">Considered details. Statement graphics. Pieces made to mean something. Select a piece to explore its details or try it on in the 3D studio.</p>
    <ProductGrid items={items} />
  </section>;
}

function ProductGrid({ items }) {
  return <div className="product-grid">{items.map((product,index) => <article className="product-card" key={product.id}>
    <a className={"product-visual visual-" + index} href={"#/product/" + product.id} aria-label={"View " + product.name}><span className="visual-mark">AURAÈ</span><small>0{index+1} / COLLECTION 01</small><i>{product.category.toUpperCase()}</i></a>
    <div className="product-meta"><div><small>{product.category.toUpperCase()}</small><h2><a href={"#/product/" + product.id}>{product.name}</a></h2></div><a className="product-arrow" href={"#/product/" + product.id} aria-label={"View " + product.name}>↗</a></div>
    <p>{product.description}</p><a className="textlink" href={"#/product/" + product.id}>VIEW DETAILS ↗</a>
  </article>)}</div>;
}

function ProductPage({ product, onAdd }) {
  const [size,setSize] = useState(product.sizes[0] || "");
  return <section className="product-detail">
    <div className={"product-detail-visual visual-" + products.indexOf(product)}><span>AURAÈ</span><small>COLLECTION 01</small></div>
    <div className="product-detail-copy"><p className="eyebrow">{product.category.toUpperCase()} / AURAÈ</p><h1>{product.name}</h1><p className="product-tag">“{product.tagline}”</p><p>{product.description}</p>
      <div className="price-note">Price and availability are confirmed directly with AURAÈ before an order is finalised.</div>
      <span className="eyebrow">SELECT SIZE</span><div className="sizes">{product.sizes.map((option) => <button key={option} className={size === option ? "size-option selected" : "size-option"} onClick={() => setSize(option)} type="button">{option}</button>)}</div>
      <div className="product-actions"><button className="pill primary" onClick={() => onAdd(product,size)} type="button">ADD TO BAG ＋</button><a className="pill outline" href={whatsapp("Hello AURAÈ, I'm interested in " + product.name + (size ? " in size " + size : "") + ". Please confirm price and availability.")} target="_blank" rel="noreferrer">ASK ON WHATSAPP ↗</a></div>
      <a className="textlink" href="#/studio">TRY IT IN THE 3D STUDIO ↗</a>
    </div>
  </section>;
}

function LookbookPage() {
  return <section className="catalog"><p className="eyebrow">AURAÈ / VISUAL DIARY</p><h1>COLLECTION <i>01.</i></h1><p className="intro">Three signatures. One unmistakable point of view.</p><ProductGrid items={products} /></section>;
}
function AboutPage() {
  return <section className="about-page"><p className="eyebrow">WHY AURAÈ EXISTS</p><h1>MADE FOR<br/><i>THE BECOMING.</i></h1><p>AURAÈ is independent streetwear built around a simple idea: what you wear can remind you who you are and where you are headed.</p><p>Dreams are the vision. Faith is the anchor. You are the becoming. Every print and every detail is a small reminder to move with intention.</p><a className="pill primary" href={contactUrl} target="_blank" rel="noreferrer">TALK TO AURAÈ ↗</a></section>;
}
function EmptyPage({title}) { return <section className="catalog empty-state"><p className="eyebrow">AURAÈ</p><h1>{title}</h1><a className="pill primary" href="#/">RETURN HOME ↗</a></section>; }
function Footer() {
  return <footer className="footer"><div className="footer-main"><a className="wordmark" href="#/">AURAÈ<span>✳</span></a><p>DREAMS. FAITH. YOU.</p><a href={contactUrl} target="_blank" rel="noreferrer">HAVE A QUESTION? SAY HELLO ↗</a></div><nav className="footer-nav"><a href="#/shop">SHOP</a><a href="#/collections">COLLECTIONS</a><a href="#/studio">3D STUDIO</a><a href="#/about">OUR STORY</a></nav><small>© {new Date().getFullYear()} AURAÈ. ALL RIGHTS RESERVED.</small></footer>;
}
export default function App() { return <CartProvider><AppShell /></CartProvider>; }
