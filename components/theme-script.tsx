/**
 * ThemeScript Component
 *
 * This inline script ensures the theme is applied immediately on page load,
 * preventing flash of wrong theme. It reads from the cookie and applies the
 * theme class to the HTML element before React hydrates.
 */
export function ThemeScript() {
	return (
		<script
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Required for immediate theme application before hydration
			dangerouslySetInnerHTML={{
				__html: `
          (function() {
            try {
              // Read theme from cookie
              const theme = document.cookie
                .split('; ')
                .find(row => row.startsWith('theme='))
                ?.split('=')[1] || 'light';
              
              // Apply theme immediately to html element
              document.documentElement.className = theme;
            } catch (e) {
              console.error('Failed to apply theme:', e);
            }
          })();
        `,
			}}
		/>
	);
}