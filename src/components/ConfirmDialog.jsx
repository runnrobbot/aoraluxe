const ConfirmDialog = ({ message, onConfirm, onCancel, loading = false }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
    onClick={!loading ? onCancel : undefined}
  >
    <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" />
    <div
      className="relative z-10 bg-white max-w-sm w-full p-7 shadow-2xl animate-slide-up"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-center text-sm text-zinc-600 mb-7 leading-relaxed">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 bg-red-500 text-white text-xs tracking-widest uppercase hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Menghapus...' : 'Ya, Hapus'}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 border border-zinc-200 text-zinc-600 text-xs tracking-widest uppercase hover:border-zinc-400 transition-colors disabled:opacity-50"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
