import { motion } from 'framer-motion';
import { getOptimizedUrl } from '../utils/cloudinary';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { name, category, price, publicId, description, stock } = product;
  const imgSrc = publicId ? getOptimizedUrl(publicId, { width: 500 }) : product.imageUrl;

  return (
    <motion.article
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group cursor-pointer bg-white overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg className="w-10 h-10 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-zinc-300 text-[0.6rem] tracking-widest uppercase">No Image</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/30 transition-all duration-300 flex items-center justify-center">
          <span className="text-white text-[0.6rem] tracking-[0.3em] uppercase py-2 px-5 border border-white/60 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
            Lihat Detail
          </span>
        </div>

        {/* Category tag */}
        {category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[0.55rem] tracking-widest uppercase px-2.5 py-1 text-zinc-600">
            {category}
          </span>
        )}
        {/* Out of stock badge */}
        {stock === 0 && (
          <span className="absolute top-3 right-3 bg-zinc-900/80 text-white text-[0.5rem] tracking-widest uppercase px-2 py-1">
            Habis
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 border-t border-zinc-100">
        <h3 className="font-serif text-zinc-900 text-base mb-1 group-hover:text-gold transition-colors duration-200 line-clamp-1">
          {name}
        </h3>
        {description && (
          <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-3 font-light">
            {description}
          </p>
        )}
        <p className="text-sm font-semibold tracking-wider" style={{ color: '#c9a84c' }}>
          Rp {price?.toLocaleString('id-ID')}
        </p>
      </div>
    </motion.article>
  );
};

export default ProductCard;
