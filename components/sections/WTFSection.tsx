// SPDX-License-Identifier: GPL-3.0-or-later

import WTFItem from 'components/WTFItem'
import { websiteData } from 'constants/index'
import Image from 'next/image'

const WTFSection: React.FC = () => {
  return (
    <section className="relative pt-20 pb-10 xl:pb-24">
      <div className="container flex flex-col items-start justify-center gap-12 xl:gap-20 px-6 xl:flex-row 2xl:gap-48">
        {/* <Image
          width={570}
          height={357}
          className="flex"
          src={websiteData.wtfSection.imageSrc}
          alt="WTF? section image"
        /> */}
        {/*<WTFImage className="w-570px max-w-full" />*/}
        <div className={'flex justify-center flex-col items-center '}>
          <Image
            className="image w-233 max-w-full"
            src={websiteData.wtfSection.imageSrc}
            alt="MicroCosm hero image"
            priority
          />
        </div>
        <div className="flex flex-col xl:w-123 mb-12">
          <h2 className="text-title1 mb-7">{websiteData.wtfSection.title}</h2>
          <p className="text-subtitle mb-4 xl:w-106">
            {websiteData.wtfSection.subtitle}
          </p>
          <p className="text-body1 w-full whitespace-pre-line">
            {websiteData.wtfSection.text}
          </p>
        </div>
      </div>
      <div className="container flex flex-col items-start justify-center mt-2 px-6 xl:px-0 xl:mt-0">
        {websiteData.wtfSection.wtfList.map((wtf) => (
          <WTFItem
            key={wtf.title}
            title={wtf.title}
            text={wtf.text}
            video={wtf.video}
          />
        ))}
      </div>
    </section>
  )
}

export default WTFSection
