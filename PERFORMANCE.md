# Performance notes

## Menu filter work

The search input waits 250 ms after the last keystroke before updating the filtered menu. A burst of eight keystrokes inside that debounce window therefore causes one filter update instead of eight: an 87.5% reduction in filter updates for that burst. Filtering is memoized and the catalog is loaded in a server component, rather than imported into the client page bundle.
