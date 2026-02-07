import * as vscode from 'vscode';

/**
 * Required GitHub OAuth scopes for the extension
 */
const GITHUB_SCOPES = ['repo', 'read:org'];

/**
 * Gets an authenticated GitHub session from VS Code.
 * Prompts user to sign in if not already authenticated.
 *
 * @returns The authentication session or undefined if auth failed
 */
export async function getGitHubSession(): Promise<vscode.AuthenticationSession | undefined> {
  try {
    const session = await vscode.authentication.getSession('github', GITHUB_SCOPES, {
      createIfNone: true,
    });
    return session;
  } catch (error) {
    if (error instanceof Error) {
      // User cancelled the authentication
      if (error.message.includes('cancelled') || error.message.includes('canceled')) {
        vscode.window.showWarningMessage('GitHub authentication was cancelled.');
        return undefined;
      }
      vscode.window.showErrorMessage(`GitHub authentication failed: ${error.message}`);
    }
    return undefined;
  }
}

/**
 * Gets the access token from the current GitHub session.
 * Useful for creating authenticated API clients.
 *
 * @returns The access token or undefined if not authenticated
 */
export async function getAccessToken(): Promise<string | undefined> {
  const session = await getGitHubSession();
  return session?.accessToken;
}
