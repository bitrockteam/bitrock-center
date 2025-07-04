const BlobAnimation = () => {
  return (
    <div className="relative">
      {/* Main animated blob */}
      <div className="blob w-48 h-48 relative">
        <div className="blob-inner absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-violet-500 filter blur-sm opacity-90 animate-blob"></div>
        <div className="blob-inner absolute inset-0 rounded-full bg-gradient-to-tr from-violet-400 via-blue-400 to-blue-500 filter blur-sm opacity-80 animate-blob animation-delay-2000"></div>
        <div className="blob-inner absolute inset-0 rounded-full bg-gradient-to-bl from-blue-300 via-violet-400 to-blue-600 filter blur-sm opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default BlobAnimation;
