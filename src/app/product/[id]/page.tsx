'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, Review } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { Star, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw, Check, MessageSquare, Plus, Heart } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);
  const product = PRODUCTS.find(p => p.id === productId);
  const { addToCart, wishlist, toggleWishlist } = useCartStore();

  const [reviewsList, setReviewsList] = useState<Review[]>(product?.reviews || []);
  const [newReviewer, setNewReviewer] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  if (!product) return (
    <div className="min-h-screen bg-[#090c15] text-white flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-black">Product Not Found</h1>
      <Link href="/" className="px-6 py-2.5 bg-indigo-600 rounded-2xl text-xs font-bold">Back to Store</Link>
    </div>
  );

  const isWishlisted = wishlist.includes(product.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewer.trim() || !newComment.trim()) return;
    const added: Review = {
      id: 'rev-' + Date.now(),
      author: newReviewer,
      rating: newRating,
      date: 'Just now',
      comment: newComment
    };
    setReviewsList([added, ...reviewsList]);
    setNewReviewer('');
    setNewComment('');
  };

  // Rating Breakdown calculations (Ella theme style)
  const totalReviews = reviewsList.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviewsList.filter(r => Math.floor(r.rating) === stars).length
  }));

  return (
    <div className="min-h-screen bg-[#090c15] text-slate-100 font-sans pb-16">
      <header className="border-b border-slate-800/80 px-6 py-4 backdrop-blur-xl bg-[#090c15]/90 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" /><span>Back to Store</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-600 rounded-xl"><ShoppingBag className="w-4 h-4 text-white" /></div>
            <span className="font-black text-sm text-white tracking-widest">SHOPPING HUB</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (<span className="absolute top-4 left-4 px-3.5 py-1 bg-indigo-600 text-white text-xs font-extrabold uppercase rounded-xl">{product.badge}</span>)}
            <button onClick={() => toggleWishlist(product.id)} className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md border transition-all ${isWishlisted ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'}`}>
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">{product.category}</span>
              <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">{product.name}</h1>
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1 text-sm font-bold">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500">({totalReviews} verified reviews)</span>
              </div>
            </div>

            <div className="border-y border-slate-800 py-4">
              <span className="text-xs text-slate-400 font-bold block uppercase">Price</span>
              <span className="text-4xl font-black text-emerald-400">AED {product.price}</span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{product.longDescription || product.description}</p>
            
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Key Highlights:</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-xl">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => addToCart(product)} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2">
              <ShoppingBag className="w-5 h-5" /><span>ADD TO CART</span>
            </button>

            <div className="grid grid-cols-3 gap-3 border-t border-slate-800 pt-6">
              <div className="text-center p-3 bg-slate-900/40 rounded-2xl border border-slate-800/60"><Truck className="w-5 h-5 text-indigo-400 mx-auto mb-1" /><span className="text-[10px] font-bold text-slate-300 block">Express Delivery</span></div>
              <div className="text-center p-3 bg-slate-900/40 rounded-2xl border border-slate-800/60"><ShieldCheck className="w-5 h-5 text-indigo-400 mx-auto mb-1" /><span className="text-[10px] font-bold text-slate-300 block">Official Warranty</span></div>
              <div className="text-center p-3 bg-slate-900/40 rounded-2xl border border-slate-800/60"><RefreshCw className="w-5 h-5 text-indigo-400 mx-auto mb-1" /><span className="text-[10px] font-bold text-slate-300 block">14-Day Free Returns</span></div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        {product.specs && (
          <div className="border border-slate-800 bg-slate-900/30 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-black text-white">Technical Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.specs.map((spec, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-medium">{spec.label}</span>
                  <span className="text-white font-bold">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews Section (Ella Theme Feature) */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-3xl p-6 sm:p-8 space-y-8">
          <div>
            <h2 className="text-lg font-black text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <span>Customer Reviews ({totalReviews})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Real feedback from verified buyers</p>
          </div>

          {/* Rating Summary Breakdown Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <div className="text-center space-y-1 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0">
              <div className="text-5xl font-black text-white">{product.rating}</div>
              <div className="flex justify-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-700'}`} />
                ))}
              </div>
              <p className="text-[11px] text-slate-400 font-bold">Based on {totalReviews} reviews</p>
            </div>

            <div className="md:col-span-2 space-y-2">
              {ratingCounts.map(({ stars, count }) => {
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center space-x-3 text-xs">
                    <span className="w-12 text-slate-400 font-bold flex items-center">{stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400 ml-1" /></span>
                    <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="w-8 text-right font-mono text-slate-400 text-[11px]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Review Form */}
          <form onSubmit={handleAddReview} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Write a Review</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input required type="text" value={newReviewer} onChange={e => setNewReviewer(e.target.value)} placeholder="Your Name" className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" />
              <select value={newRating} onChange={e => setNewRating(Number(e.target.value))} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500">
                <option value={5}>5 Stars - Outstanding</option>
                <option value={4}>4 Stars - Very Good</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Needs Improvement</option>
                <option value={1}>1 Star - Poor</option>
              </select>
            </div>
            <textarea required rows={2} value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Share details about quality, shipping, or fit..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" />
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors">
              <Plus className="w-4 h-4" /><span>Post Review</span>
            </button>
          </form>

          {/* Review List */}
          <div className="space-y-4">
            {reviewsList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviewsList.map((rev) => (
                <div key={rev.id} className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{rev.author}</span>
                    <span className="text-[10px] text-slate-500">{rev.date}</span>
                  </div>
                  <div className="flex items-center text-amber-400 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rev.rating) ? 'fill-amber-400' : 'text-slate-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
