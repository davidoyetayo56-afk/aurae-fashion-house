import { useCart } from "../state/cart.jsx";

export default function CartDrawer({ open, onClose }) {
  const { items, setQty, remove, url } = useCart();
  return <>
    <button className={"drawer-scrim" + (open ? " visible" : "")} type="button" aria-label="Close shopping bag" tabIndex={open ? 0 : -1} onClick={onClose}/>
    <aside className={"drawer" + (open ? " open" : "")} role="dialog" aria-modal={open} aria-hidden={!open} aria-label="Shopping bag">
      <div className="row">
        <h3>YOUR BAG <span className="cart-items-count">({items.reduce((sum,item) => sum + item.qty, 0)})</span></h3>
        <button className="ghost" type="button" onClick={onClose}>CLOSE ×</button>
      </div>
      <div className="drawer-items">
        {!items.length && <p className="dim cart-empty">Your bag is waiting for its first piece.</p>}
        {items.map((item) => <div className="line" key={item.key}>
          <div className="cart-item-mark" aria-hidden="true"><span>AURAÈ</span></div>
          <div>
            <b>{item.product.name}</b>
            <small>{item.size && item.size !== "One size" ? "Size " + item.size : "One size"} · Qty {item.qty}</small>
            <div className="qty">
              <button type="button" aria-label={"Decrease " + item.product.name + " quantity"} onClick={() => item.qty <= 1 ? remove(item.key) : setQty(item.key,item.qty-1)}>−</button>
              <span>{item.qty}</span>
              <button type="button" aria-label={"Increase " + item.product.name + " quantity"} onClick={() => setQty(item.key,item.qty+1)}>+</button>
              <button className="ghost" type="button" onClick={() => remove(item.key)}>Remove</button>
            </div>
          </div>
        </div>)}
      </div>
      <div className="cart-summary">
        <p>We'll confirm current pricing, stock and delivery with you on WhatsApp before you finalise your order.</p>
        <a className={"btn" + (items.length ? "" : " off")} href={items.length ? url : undefined} target="_blank" rel="noreferrer" aria-disabled={!items.length} onClick={(event) => { if (!items.length) event.preventDefault(); }}>SEND BAG TO WHATSAPP <span>↗</span></a>
        <button className="continue-shopping" type="button" onClick={onClose}>Continue exploring</button>
      </div>
    </aside>
  </>;
}
