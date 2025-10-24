export const checkForSanctions = async (
  address: string
): Promise<Record<string, any>> => {
  try {
    const result = await fetch(`/api/chainalysis`, {
      headers: {
        Accept: 'application/json',
        Address: address
      },
    })

    const data = await result.json()
    return data
  } catch (error) {
    console.error(error)
    return error as unknown as Record<'message', string>
  }
}
