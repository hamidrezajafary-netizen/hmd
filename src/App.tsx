import BurgerHero from './components/BurgerHero';
import CartDrawer from './components/CartDrawer';
import Header from './components/Header';
import { CartProvider } from './store/cart';

/**
 * One full-screen experience: the scroll-scrubbed burger is the page, and every UI element
 * floats above it (header, order panel, cart, scroll cue, chapter captions).
 */
export default function App() {
  return (
    <CartProvider>
      <Header />
      <main>
        <BurgerHero />
      </main>
      <CartDrawer />
    </CartProvider>
  );
}
