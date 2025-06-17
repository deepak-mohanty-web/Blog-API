// generate random user name (e.g. user-abc123)

export const getUserName = (): string => {
  const usernamePrefix = 'user-';
  const randomChars = Math.random().toString(36).slice(2);
  const username = usernamePrefix + randomChars;
  return username;
}

// generate a random slug from a title (e.g. my-title-abc123)
// @parma title - The title to generate a slug from
// returns - A random slug

export const genSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  const randomChars = Math.random().toString(36).slice(2);
  const uniqueSlug = `${slug}-${randomChars}`;

  return uniqueSlug;
}