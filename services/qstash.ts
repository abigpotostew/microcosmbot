//curl -XPOST \
//     -H 'Authorization: Bearer XXX' \
//     -H "Upstash-Retries: 3" \
//     -H "Content-type: application/json" \
//     -d '{ "hello": "world" }' \
//      'https://qstash.upstash.io/v1/publish/https://example.com'

export const publishMessage = async ({
  data,
  retries = 3,
  url,
}: {
  data: any
  retries?: number
  url: string
}) => {
  //
  const qstashUrl = `${process.env.QSTASH_URL}${url}`
  const res = await fetch(qstashUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Upstash-Retries': retries.toString(),
      Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.json()
    throw new Error('failed to publish message: ' + body)
  }
}
