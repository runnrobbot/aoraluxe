const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-2 border-zinc-200 border-t-gold rounded-full animate-spin`}
        style={{ borderTopColor: '#c9a84c' }}
      />
    </div>
  );
};

export default LoadingSpinner;
