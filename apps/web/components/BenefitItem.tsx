// SPDX-License-Identifier: GPL-3.0-or-later

import { IBenefitItem } from 'libs/types'

const BenefitItem: React.FC<IBenefitItem> = ({ icon, title, description }) => (
  <div className="relative flex flex-col items-center w-64 xl:w-76">
    <div className="w-25">{icon}</div>
    <h3 className="text-title3 text-center mt-5">{title}</h3>
    <p className="text-body2 text-center mt-3 w-full">{description}</p>
  </div>
)

export default BenefitItem
