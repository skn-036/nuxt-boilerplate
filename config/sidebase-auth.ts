const permissionType = `{
  _id: string,
  id: string,
  value: string,
  description: string,
  label: string,
  module: string
}`;

const roleType = `{
  _id: string,
  id: string,
  name: string,
  type: string,
  permissions: ${permissionType}[]
}`;

export const userType = {
  _id: 'string', // Mongo ObjectId
  id: 'string', // duplicate convenience field
  name: 'string',
  email: 'string',
  phoneNumber: 'string | null | undefined',
  roles: `${roleType}[]`,
  createdAt: 'string',
  updatedAt: 'string',
} as const;
