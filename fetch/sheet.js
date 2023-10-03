export const getHeaders = async () => {
  const res = await fetch('/api/headers')
  const data = await res.json()
  return data
}

export const addDiscussion = async () => {
  const res = await fetch('/api/add', { method: 'POST' })
  const data = await res.json()
  return data
}

export const getDiscussionData = async (id) => {
  const res = await fetch(`/api/discussion/${id}`)
  const data = await res.json()
  return data
}

export const setPresent = async (id, discussion, uca) => {
  const res = await fetch(`/api/present/${id}/${discussion}/${uca}`, { method: 'POST' })
  const data = await res.json()
  return data
}

export const setAbsent = async (id, discussion) => {
  const res = await fetch(`/api/absent/${id}/${discussion}`, { method: 'POST' })
  const data = await res.json()
  return data
}