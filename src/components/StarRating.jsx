function StarRating({rating}) {
    return (
        <div>
            { rating ? (
                <span className="text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                            {star <= rating ? '★' : '☆' }
                        </span>
                    ))}
                </span>
            ) : (
                <span>Belum ada rating</span>
            )}
       </div>
    )
}

export default StarRating;