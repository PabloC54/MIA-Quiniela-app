import { useRouter, useLocation, Router } from 'wouter'

export default function NestedRoutes({ base, children }) {
  const router = useRouter()
  const [parentLocation] = useLocation()
  const nestedBase = `${router.base}${base}`

  if (!parentLocation.startsWith(nestedBase)) return null

  return (
    <Router base={nestedBase} key={nestedBase}>
      {children}
    </Router>
  )
}
