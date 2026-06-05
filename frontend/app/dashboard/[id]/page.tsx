export default async function DatasetPage(
  props: PageProps<"/dashboard/[id]">
) {
  const { id } = await props.params;
  return <div>{id}</div>;
}
