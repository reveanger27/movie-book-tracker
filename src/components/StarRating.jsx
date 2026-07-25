function StarRating({rating}) {
    return (
        <span className="text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                    {star <= rating ? '★' : '☆' }
                </span>
            ))}
        </span>
    )
}

export default StarRating;