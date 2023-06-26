import { websiteData } from 'constants/websiteData'
import { ManageGroup } from 'components/ManageGroup'
import AlertAttentionNeeded from 'components/info/AlertAttentionNeeded'

const ManageGroupView: React.FC = () => {
  return (
    <>
      <header className="relative z-50 bg-olive-200 pt-16 pb-8 lg:pb-9">
        <div className="container flex flex-col px-6 gap-8 lg:gap-0 lg:items-center lg:flex-row">
          <div className="flex flex-col gap-4 flex-grow flex-shrink-0">
            <h1 className="text-title2">{websiteData.manageSection.title}</h1>
            <p className="text-body4 text-olive-600">
              {websiteData.manageSection.subtitle}
            </p>
          </div>
          {/*  <div className="flex items-center justify-between mb-4 sm:justify-start lg:mb-0">*/}
          {/*      {Object.entries(stats).map(([key, value], i) => (*/}
          {/*          <div*/}
          {/*              key={`key-${i}`}*/}
          {/*              className={classNames(*/}
          {/*                  'flex flex-col flex-shrink-0 border-r border-olive-500 pl-1 pr-3 gap-3 pt-4 pb-3 sm:gap-5 sm:pr-16 sm:pl-7',*/}
          {/*                  i === 0 ? 'pl-0 sm:pl-0' : '',*/}
          {/*                  i == Object.keys(stats).length - 1 ? 'border-none lg:pr-11' : ''*/}
          {/*              )}*/}
          {/*          >*/}
          {/*              <span className="text-title5">{value}</span>*/}
          {/*              <span className="text-body4 text-olive-600">*/}
          {/*  {STATS_LABELS[key]}*/}
          {/*</span>*/}
          {/*          </div>*/}
          {/*      ))}*/}
          {/*  </div>*/}
        </div>
      </header>
      <div
        className={
          'container flex flex-col px-6 gap-8 lg:gap-0 lg:items-center lg:flex-row'
        }
      >
        <ManageGroup />
      </div>
      <AlertAttentionNeeded>
        Do not share this link with anyone.
      </AlertAttentionNeeded>
    </>
  )
}

export default ManageGroupView
