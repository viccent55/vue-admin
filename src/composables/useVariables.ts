import { useLocale } from "@vuetify/v0";

const useVariables = () => {
  const store = useStore();
  const route = useRoute();
  const router = useRouter();
  const locale = useLocale();
  const { mobile } = useDisplay()
  const onCopy = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        console.log("✅ Copied via Clipboard API!");
        return true;
      } catch (err) {
        console.warn("Clipboard API failed, falling back:", err);
      }
    }
    // Fallback for insecure contexts
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return true;
  };
  const debounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number
  ) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  };
  return {
    store,
    route,
    router,
    onCopy,
    debounce,
    locale,
    mobile,
  };
};
export default useVariables;
