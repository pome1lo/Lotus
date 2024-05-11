const Comment = ({ username, text, user_picture, date }) => {
    return(
        <div className="d-flex text-muted pt-3 justify-content-between">
            <div className="d-flex mr-2">
                <img className="mr-2 border-radius" width="35" height="35" src={user_picture} alt="content"/>
                <p className="pb-3 mb-0 small lh-sm border-bottom">
                    <strong className="d-block text-gray-dark">{username}</strong>
                    {text}
                </p>
            </div>
            <p className="small" style={{minWidth: 130}}>{`${new Date(date).toLocaleString("en", {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            })}`}</p>
        </div>
    )
}

export {Comment}