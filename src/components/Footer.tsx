import { WA_BASE_URL } from '../constants/whatsapp';

const IG_LINK = 'https://www.instagram.com/aoraluxe';
const TOKPED_LINK = 'https://www.tokopedia.com/aoraluxelane';

const Footer = () => (
  <footer id="about" className="bg-zinc-950 text-white">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-3 gap-12 pb-12 border-b border-zinc-800/60">

        {/* Brand */}
        <div>
          <h3 className="font-serif text-2xl mb-1" style={{ color: '#c9a84c' }}>AORA LUXE</h3>
          <p className="text-[0.6rem] tracking-[0.4em] uppercase text-zinc-500 mb-5">Est. 2024</p>
          <p className="font-serif italic text-zinc-300 text-base leading-relaxed mb-2">
            "branded for every you"
          </p>
          <p className="text-zinc-500 text-xs leading-relaxed italic">
            People will stare. Make it worth their while.
          </p>
        </div>

        {/* Temukan Kami */}
        <div>
          <h4 className="text-[0.65rem] tracking-[0.45em] uppercase text-zinc-500 mb-5">Temukan Kami</h4>
          <ul className="space-y-4">
            <li>
              <a href={TOKPED_LINK} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-zinc-400 text-sm hover:text-gold transition-colors duration-200 group">
                <svg className="w-4 h-4 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1.5 14.5h-3v-7h3v7zm-1.5-8.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
                </svg>
                Tokopedia — aoraluxelane
              </a>
            </li>
            <li>
              <a href={IG_LINK} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-zinc-400 text-sm hover:text-gold transition-colors duration-200 group">
                <svg className="w-4 h-4 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
                </svg>
                Instagram — @aoraluxe
              </a>
            </li>
            <li>
              <a href={WA_BASE_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-zinc-400 text-sm hover:text-gold transition-colors duration-200 group">
                <svg className="w-4 h-4 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp — Chat Langsung
              </a>
            </li>
          </ul>
        </div>

        {/* Lokasi */}
        <div>
          <h4 className="text-[0.65rem] tracking-[0.45em] uppercase text-zinc-500 mb-5">Lokasi</h4>
          <div className="flex gap-3">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <div>
              <p className="text-zinc-300 text-sm leading-relaxed">Palem 1 No. 5</p>
              <p className="text-zinc-400 text-sm">Griya Utama, Rancaekek</p>
            </div>
          </div>
          <div className="mt-6">
            <a href={WA_BASE_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 text-gold text-[0.65rem] tracking-widest uppercase hover:bg-gold hover:text-zinc-900 transition-all duration-300">
              Order Sekarang
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
        <p className="text-zinc-600 text-xs tracking-wider">
          © {new Date().getFullYear()} AORA LUXE. Semua hak cipta dilindungi.
        </p>
        <p className="text-zinc-700 text-[0.6rem] tracking-[0.5em] uppercase">
          Branded For Every You
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
