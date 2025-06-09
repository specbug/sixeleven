import Prism from "prismjs/components/prism-core"

// Make Prism available globally for other components to register themselves
if (typeof global !== "undefined") {
  ;(global as any).Prism = Prism
}
if (typeof window !== "undefined") {
  ;(window as any).Prism = Prism
}

// Import languages for their side-effects.
// They will automatically register themselves with the global Prism object.
// The order is important because of dependencies.
import "prismjs/components/prism-clike"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-json"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-ini"
import "prismjs/components/prism-python"

export default Prism 