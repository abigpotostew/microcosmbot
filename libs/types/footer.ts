export interface FooterLink {
  name: string
  url: string
  external: boolean
}

export interface FooterLinksRow {
  type: string
  links: FooterLink[]
}
