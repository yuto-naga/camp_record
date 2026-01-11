export default function StarRating({ rating, maxRating = 5 }: { rating: number, maxRating?: number }) {
    if (!rating || rating <= 0) return null

    return (
        <div className="flex items-center" aria-label={`評価: ${rating} / ${maxRating}`}>
            <span className="text-yellow-400">
                {'★'.repeat(rating)}
                <span className="text-gray-300">{'☆'.repeat(maxRating - rating)}</span>
            </span>
        </div>
    )
}
