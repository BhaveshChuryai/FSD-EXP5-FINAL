import './PageLoader.css'

export default function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__ring">
        <div className="page-loader__inner" />
      </div>
      <p className="page-loader__text">PLOTTAGE HUB</p>
    </div>
  )
}
