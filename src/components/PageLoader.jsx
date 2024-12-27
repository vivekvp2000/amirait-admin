
const PageLoader = () => {
    return (
        <div className="fixed inset-0 h-screen z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="w-10 h-10 border-4 rounded-full border-t-blue-500 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"></div>
        </div>
    )
}

export default PageLoader