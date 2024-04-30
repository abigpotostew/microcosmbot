import 'dotenv/config'
import { getDaoDaoContractAndNft } from '@microcosms/bot'

async function main() {
  console.log(
    await getDaoDaoContractAndNft(
      'stars1dg9vrt4w0d375vr2eje273f4tlce933fgscw7u4ycqgk9mhjkp6qaq2svd'
    )
  )
}
main()
