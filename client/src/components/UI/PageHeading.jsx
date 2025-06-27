import PropTypes from "prop-types";

export function PageHeading({ title }) {
  return (
    // Heading component for the page
    <div className="flex items-center-safe gap-2 my-2 md:my-4">
      <div className="w-2 h-8 bg-primary rounded-r-2xl"></div>
      <h2 className="md:!text-xl !font-bold">{title}</h2>
    </div>
  );
}
PageHeading.propTypes = {
  title: PropTypes.string.isRequired,
};
