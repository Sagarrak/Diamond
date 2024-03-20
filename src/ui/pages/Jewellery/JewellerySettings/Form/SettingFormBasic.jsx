import React, { useMemo, useState } from 'react'
import { Controller } from 'react-hook-form';
import { FormFeedback, Input, Label } from 'reactstrap';
import { JEWELLERY_CATEGORIES } from '../../admin/query';
import { GET_ALL_STYLE_BY_CATEGORY } from '../../product/query';
import { useQuery } from 'react-apollo';
import Select from 'react-select';

const SettingFormBasic = (props) => {
	const { register, errors, control, className ,setCategory,category} = props;	

	// Queries
	const { data: categories, loading: categoriesLoading, } = useQuery(JEWELLERY_CATEGORIES, {
		fetchPolicy: "cache-and-network"
	});
	const { data: styleData, loading: styleLoading } = useQuery(GET_ALL_STYLE_BY_CATEGORY, {
		variables: { getAllStyleByCategoryId: category?.value },
		fetchPolicy: "cache-and-network",
	});

	const categoryOption = useMemo(() => { return categories?.jewelryCategoriesWithoutPaginations?.map(d => { return { value: d?.id, label: d?.name } }) }, [categories]);;
	const categoryStyleOption = useMemo(() => { return styleData?.getAllStyleByCategory?.map((d) => { return { value: d?.id, label: d?.styleName } }) }, [styleData, category]);

	return (
		<div className={className || ""}>
			<div className="mb-1">
				<Label className="form-label" htmlFor="categoryId">Category<span className="text-danger">&#42;</span></Label>
				<Controller
					id="categoryId"
					name="categoryId"
					control={control}
					render={({ field: { onChange, value } }) => {
						return (
							<Select {...register("categoryId", { required: true, })}
								value={categoryOption?.find((options) => options?.label === value?.name) || value?.name}
								options={categoryOption}
								placeholder="Select category"
								onChange={(e) => { onChange(e?.value); setCategory(e); }}
							/>
						);
					}}
				/>
				{errors && errors?.categoryId && (<FormFeedback>Please enter valid category</FormFeedback>)}
			</div>

			<div className="mb-1">
				<Label className="form-label" htmlFor="styleId">Style ID<span className="text-danger">&#42;</span></Label>
				<Controller
					id="styleId"
					name="styleId"
					control={control}
					render={({ field: { onChange, value } }) => {
						return (
							<Select {...register("styleId", { required: true, })}
								value={categoryStyleOption?.find((options) => options?.label === value?.styleName) || value?.styleName}
								options={categoryStyleOption}
								placeholder="Select style Id"
								onChange={(e) => { onChange(e?.value); }}
							/>
						);
					}}
				/>
				{errors && errors?.styleId && (
					<FormFeedback>Please select styleId</FormFeedback>
				)}
			</div>

			<div className="mb-1">
				<Label className="form-label" htmlFor="name">Name<span className="text-danger">&#42;</span></Label>
				<Controller
					id="name"
					name="name"
					defaultValue=""
					rules={{required:"please enrer name"}}
					{...register("name", )}
					control={control}
					render={({ field }) => (<Input type="text" placeholder="Enter name" invalid={!!errors.name && true}{...field} />)}
				/>
				{errors && errors?.name && (<FormFeedback>Please enter a valid name</FormFeedback>)}
			</div>

			<div className="mb-1">
				<Label className="form-label" htmlFor="width"> width </Label>
				<Controller
					id="width"
					name="width"
					defaultValue=""
					{...register("width", {})}
					control={control}
					render={({ field }) => (<Input type="number" placeholder="Enter width" invalid={errors.width && true}{...field} />)}
				/>
				{errors && errors?.width && (<FormFeedback>Please enter a valid width</FormFeedback>)}
			</div>

			<div className="mb-1">
				<Label className="form-label" htmlFor="length">Length</Label>
				<Controller
					id="length"
					name="length"
					defaultValue=""
					{...register("length", {})}
					control={control}
					render={({ field }) => (<Input type="number" placeholder="Enter length" invalid={errors.length && true}	{...field} />)}
				/>
				{errors && errors?.length && (<FormFeedback>Please enter a valid length</FormFeedback>)}
			</div>

		</div>
	)
}

export default SettingFormBasic