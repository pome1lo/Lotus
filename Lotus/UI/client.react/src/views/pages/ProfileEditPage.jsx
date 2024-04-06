import {useParams} from "react-router-dom";

const ProfileEditPage = () => {
  const {username} = useParams();

  return (
      <div className={`col-md-10 order-md-2`}>
          <h1>edit {username}</h1>

          <div className="d-flex text-body-secondary pt-3">
              <svg className="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32"
                   xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32"
                   preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title>
                  <rect width="100%" height="100%" fill="#007bff"></rect>
                  <text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text>
              </svg>
              <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
                  <div className="d-flex justify-content-between">
                      <strong className="text-gray-dark">Full Name</strong>
                  </div>
                  <span className="d-block">@username</span>
              </div>
          </div>

      </div>
  )
}

export {ProfileEditPage}