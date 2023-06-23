import path from 'path'

const buildGetActionConstants =
  (deps: { mocksPath: string }) => (actionName: string) => {
    const filePath = path.join(deps.mocksPath, actionName, 'index.shtml')
    const resultFilePath = path.join(deps.mocksPath, actionName, 'result.html')

    return {
      name: actionName,
      filePath,
      resultFilePath,
    }
  }

export const getConstants = (name: string) => {
  const mocksPath = path.resolve(
    __dirname,
    '..',
    '..',
    '__tests__',
    'mocks',
    name
  )

  return {
    getActionConstants: buildGetActionConstants({
      mocksPath,
    }),
    mocksPath,
  }
}
