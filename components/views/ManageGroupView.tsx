import { websiteData } from 'constants/websiteData'
import { ManageGroup } from 'components/ManageGroup'
import AlertAttentionNeeded from 'components/info/AlertAttentionNeeded'
import FrameBlock from '../FrameBlock'
import { useRouter } from 'next/router'

const ManageGroupView: React.FC = () => {
  const router = useRouter()
  return (
    <>
      <header className="relative z-50 bg-olive-200 pt-8 pb-8 lg:pb-9">
        <div className="container flex flex-col px-6 gap-8 lg:gap-0 lg:items-center lg:flex-row">
          <div className="flex flex-col gap-4 flex-grow flex-shrink-0">
            <h1 className="text-title2">{websiteData.manageSection.title}</h1>
            <p className="text-body4 text-olive-600">
              {websiteData.manageSection.subtitle}
            </p>
          </div>
          <div>
            <p className={'text-body3'}>Admin code: {router.query.code}</p>
            <p className={'text-body4 text-olive-600'}>
              (Do not share this code with anyone)
            </p>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className="mx-auto max-w-3xl">
          {/* Content goes here */}
          <FrameBlock classes="col-span-8 lg:col-start-3 lg:row-end-1 text-body4">
            <h2 className="sr-only">Verify Wallet & Prove Ownership</h2>
            <div className={' bg-olive-200 p-8'}>
              <ManageGroup />
            </div>
            {/*<div className="rounded-lg bg-gray-50 bg-olive-200 shadow-sm ring-1 ring-gray-900/5">*/}
            {/*  <dl className="flex flex-wrap">*/}
            {/*    <div className="flex-auto pl-6 pt-6"></div>*/}
            {/*  </dl>*/}
            {/*</div>*/}
          </FrameBlock>
        </div>
      </div>
      {/*<div*/}
      {/*  className={*/}
      {/*    'container flex flex-col px-6 gap-8 lg:gap-0 lg:items-center lg:flex-row'*/}
      {/*  }*/}
      {/*>*/}
      {/*  <ManageGroup />*/}
      {/*</div>*/}
      {/*<AlertAttentionNeeded>*/}
      {/*  Do not share this link with anyone.*/}
      {/*</AlertAttentionNeeded>*/}
    </>
  )
}

export default ManageGroupView
